-- ClinicaWeb - Initial Supabase schema
-- Execute in Supabase SQL editor

create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'secretaria', 'medico');
create type public.appointment_status as enum ('Confirmado', 'Pendiente', 'Cancelado');
create type public.doctor_status as enum ('Activo', 'Licencia');

create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (clinic_id, name)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete restrict,
  clinic_name text not null,
  branch_name text not null,
  full_name text not null,
  email text not null,
  role public.app_role not null,
  specialty text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete restrict,
  full_name text not null,
  dni text not null,
  phone text,
  age integer not null check (age > 0 and age < 130),
  obra_social text not null,
  last_visit date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clinic_id, dni)
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete restrict,
  full_name text not null,
  specialty text not null,
  branch_name text not null,
  shift text not null,
  status public.doctor_status not null default 'Activo',
  created_at timestamptz not null default now()
);

create table if not exists public.doctor_specialties (
  doctor_id uuid not null references public.doctors(id) on delete cascade,
  specialty_id uuid not null references public.specialties(id) on delete cascade,
  primary key (doctor_id, specialty_id)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  branch_id uuid not null references public.branches(id) on delete restrict,
  patient_id uuid not null references public.patients(id) on delete restrict,
  doctor_id uuid not null references public.doctors(id) on delete restrict,
  specialty text not null,
  date date not null,
  time time not null,
  status public.appointment_status not null default 'Pendiente',
  notes text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_clinic_branch on public.profiles (clinic_id, branch_id);
create index if not exists idx_patients_clinic_branch on public.patients (clinic_id, branch_id);
create index if not exists idx_doctors_clinic_branch on public.doctors (clinic_id, branch_id);
create index if not exists idx_appointments_clinic_branch_date on public.appointments (clinic_id, branch_id, date);
create index if not exists idx_appointments_doctor_date on public.appointments (doctor_id, date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_patients_updated_at on public.patients;
create trigger set_patients_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

drop trigger if exists set_appointments_updated_at on public.appointments;
create trigger set_appointments_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create or replace function public.current_profile()
returns public.profiles
language sql
stable
security definer
set search_path = public
as $$
  select p.*
  from public.profiles p
  where p.id = auth.uid()
  limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.specialties enable row level security;
alter table public.doctor_specialties enable row level security;

-- Profiles
create policy "profiles_select_own_clinic"
on public.profiles
for select
using (
  clinic_id = (select clinic_id from public.current_profile())
);

-- Patients
create policy "patients_select_by_role"
on public.patients
for select
using (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) = 'admin'
    or ((select role from public.current_profile()) = 'secretaria' and branch_id = (select branch_id from public.current_profile()))
    or (
      (select role from public.current_profile()) = 'medico'
      and (
        exists (
          select 1
          from public.appointments a
          join public.doctors d on d.id = a.doctor_id
          where a.patient_id = patients.id
            and d.profile_id = auth.uid()
        )
        or exists (
          select 1
          from public.appointments a
          join public.doctors mydoc on mydoc.profile_id = auth.uid()
          where a.patient_id = patients.id
            and a.specialty = mydoc.specialty
        )
      )
    )
  )
);

create policy "patients_insert_admin_secretaria"
on public.patients
for insert
with check (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) = 'admin'
    or (
      (select role from public.current_profile()) = 'secretaria'
      and branch_id = (select branch_id from public.current_profile())
    )
  )
);

create policy "patients_update_admin_secretaria"
on public.patients
for update
using (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) = 'admin'
    or (
      (select role from public.current_profile()) = 'secretaria'
      and branch_id = (select branch_id from public.current_profile())
    )
  )
);

-- Doctors
create policy "doctors_select_by_role"
on public.doctors
for select
using (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) in ('admin', 'secretaria')
    or (
      (select role from public.current_profile()) = 'medico'
      and profile_id = auth.uid()
    )
  )
);

-- Appointments
create policy "appointments_select_by_role"
on public.appointments
for select
using (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) = 'admin'
    or ((select role from public.current_profile()) = 'secretaria' and branch_id = (select branch_id from public.current_profile()))
    or (
      (select role from public.current_profile()) = 'medico'
      and exists (
        select 1
        from public.doctors d
        where d.id = appointments.doctor_id
          and d.profile_id = auth.uid()
      )
    )
  )
);

create policy "appointments_insert_admin_secretaria"
on public.appointments
for insert
with check (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) = 'admin'
    or ((select role from public.current_profile()) = 'secretaria' and branch_id = (select branch_id from public.current_profile()))
  )
);

create policy "appointments_update_by_role"
on public.appointments
for update
using (
  clinic_id = (select clinic_id from public.current_profile())
  and (
    (select role from public.current_profile()) in ('admin', 'secretaria')
    or (
      (select role from public.current_profile()) = 'medico'
      and exists (
        select 1
        from public.doctors d
        where d.id = appointments.doctor_id
          and d.profile_id = auth.uid()
      )
    )
  )
);

-- Specialties
create policy "specialties_select_same_clinic"
on public.specialties
for select
using (
  clinic_id = (select clinic_id from public.current_profile())
);

create policy "doctor_specialties_select_same_clinic"
on public.doctor_specialties
for select
using (
  exists (
    select 1
    from public.doctors d
    where d.id = doctor_specialties.doctor_id
      and d.clinic_id = (select clinic_id from public.current_profile())
  )
);
