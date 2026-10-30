import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ifyturmeretuirrzwvwf.supabase.co'
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_nIMDBaVpWRSPCq9Pn2k8lw_WBDcq1mU'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
