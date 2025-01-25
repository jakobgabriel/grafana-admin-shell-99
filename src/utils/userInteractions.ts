import { supabase } from "@/integrations/supabase/client";

export type UserInteractionEvent = {
  event_type: string;
  component: string;
  details?: Record<string, any>;
};

export const logUserInteraction = async (event: UserInteractionEvent) => {
  console.log('Logging user interaction:', event);
  
  try {
    const { error } = await supabase
      .from('user_interactions')
      .insert([event]);

    if (error) {
      console.error('Error logging user interaction:', error);
    }
  } catch (err) {
    console.error('Failed to log user interaction:', err);
  }
};