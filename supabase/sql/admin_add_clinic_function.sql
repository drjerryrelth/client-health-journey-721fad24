
-- Function to allow admins to add clinics
CREATE OR REPLACE FUNCTION public.admin_add_clinic(clinic_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_clinic_id UUID;
  new_clinic JSONB;
  user_role TEXT;
BEGIN
  -- Get the current user's role
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  
  -- Check if the user is an admin
  IF user_role != 'admin' AND user_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only admin users can add clinics';
  END IF;
  
  -- Insert the clinic record
  INSERT INTO public.clinics (
    name,
    email,
    phone,
    street_address,
    city,
    state,
    zip,
    primary_contact,
    billing_contact_name,
    billing_email,
    billing_phone,
    billing_address,
    billing_city,
    billing_state,
    billing_zip,
    payment_method,
    subscription_tier,
    subscription_status,
    logo,
    primary_color,
    secondary_color
  ) VALUES (
    clinic_data->>'name',
    clinic_data->>'email',
    clinic_data->>'phone',
    clinic_data->>'street_address',
    clinic_data->>'city',
    clinic_data->>'state',
    clinic_data->>'zip',
    clinic_data->>'primary_contact',
    clinic_data->>'billing_contact_name',
    clinic_data->>'billing_email',
    clinic_data->>'billing_phone',
    clinic_data->>'billing_address',
    clinic_data->>'billing_city',
    clinic_data->>'billing_state',
    clinic_data->>'billing_zip',
    clinic_data->>'payment_method',
    clinic_data->>'subscription_tier',
    clinic_data->>'subscription_status',
    clinic_data->>'logo',
    clinic_data->>'primary_color',
    clinic_data->>'secondary_color'
  )
  RETURNING id INTO new_clinic_id;
  
  -- Get the newly created clinic record
  SELECT to_jsonb(c.*) INTO new_clinic
  FROM public.clinics c
  WHERE c.id = new_clinic_id;
  
  -- Return the new clinic record
  RETURN new_clinic;
END;
$$;

-- Optionally add a policy to clinics table allowing admins to manage clinics
DO $$
BEGIN
  -- Check if the policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'clinics' AND policyname = 'Admin users can manage clinics'
  ) THEN
    -- Create policy if it doesn't exist
    CREATE POLICY "Admin users can manage clinics" 
      ON public.clinics 
      USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
      );
  END IF;
END $$;

-- Ensure RLS is enabled on clinics table
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- Function to add a coach to a clinic (used in mutation-service.ts)
CREATE OR REPLACE FUNCTION public.add_coach(
  coach_name TEXT,
  coach_email TEXT,
  coach_phone TEXT,
  coach_status TEXT,
  coach_clinic_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_coach_id UUID;
BEGIN
  INSERT INTO public.coaches (
    name,
    email,
    phone,
    status,
    clinic_id
  ) VALUES (
    coach_name,
    coach_email,
    coach_phone,
    coach_status,
    coach_clinic_id
  )
  RETURNING id INTO new_coach_id;
  
  RETURN new_coach_id;
END;
$$;
