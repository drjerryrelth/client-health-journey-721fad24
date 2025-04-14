import { supabase } from '@/integrations/supabase/client';
import { format, subMonths } from 'date-fns';

export interface RevenueData {
  month: string;
  revenue: number;
  clients: number;
}

export interface SubscriptionData {
  id: string;
  name: string;
  plan: string;
  price: string;
  startDate: string;
  clients: number;
}

export async function fetchRevenueData(clinicId?: string): Promise<RevenueData[]> {
  try {
    // Get the last 6 months of data
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return format(date, 'MMM');
    }).reverse();

    const revenueData: RevenueData[] = [];

    for (const month of months) {
      // Calculate start and end dates for the month
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months.indexOf(month));
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);

      // Build the query
      let query = supabase
        .from('check_ins')
        .select('id, client_id, created_at')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      // Add clinic filter if provided
      if (clinicId) {
        query = query.eq('clinic_id', clinicId);
      }

      const { data: checkIns, error: checkInsError } = await query;

      if (checkInsError) {
        console.error(`Error fetching check-ins for ${month}:`, checkInsError);
        continue;
      }

      // Count unique clients
      const uniqueClients = new Set(checkIns?.map(checkIn => checkIn.client_id) || []).size;

      // Calculate revenue (assuming $100 per check-in for now - you may want to adjust this)
      const revenue = (checkIns?.length || 0) * 100;

      revenueData.push({
        month,
        revenue,
        clients: uniqueClients
      });
    }

    return revenueData;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}

export async function fetchSubscriptionData(clinicId?: string): Promise<SubscriptionData[]> {
  try {
    let query = supabase
      .from('clinics')
      .select('id, name, subscription_tier, created_at');

    // Add clinic filter if provided
    if (clinicId) {
      query = query.eq('id', clinicId);
    }

    const { data: clinics, error: clinicsError } = await query;

    if (clinicsError) {
      console.error('Error fetching clinics:', clinicsError);
      throw clinicsError;
    }

    const subscriptionData: SubscriptionData[] = [];

    for (const clinic of clinics || []) {
      // Get client count for this clinic
      const { count: clientCount, error: clientCountError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('clinic_id', clinic.id);

      if (clientCountError) {
        console.error(`Error counting clients for clinic ${clinic.id}:`, clientCountError);
        continue;
      }

      // Map subscription tier to price
      const priceMap: Record<string, string> = {
        'basic': '$149/month',
        'professional': '$249/month',
        'enterprise': '$399/month'
      };

      subscriptionData.push({
        id: clinic.id,
        name: clinic.name,
        plan: clinic.subscription_tier || 'basic',
        price: priceMap[clinic.subscription_tier || 'basic'] || '$149/month',
        startDate: format(new Date(clinic.created_at || new Date()), 'MM/dd/yyyy'),
        clients: clientCount || 0
      });
    }

    return subscriptionData;
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    throw error;
  }
}

export async function fetchTotalRevenue(clinicId?: string): Promise<number> {
  try {
    let query = supabase
      .from('check_ins')
      .select('id');

    if (clinicId) {
      query = query.eq('clinic_id', clinicId);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error counting check-ins:', error);
      throw error;
    }

    // Assuming $100 per check-in
    return (count || 0) * 100;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw error;
  }
}

export async function fetchTotalClients(clinicId?: string): Promise<number> {
  try {
    let query = supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (clinicId) {
      query = query.eq('clinic_id', clinicId);
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error counting clients:', error);
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error fetching total clients:', error);
    throw error;
  }
} 