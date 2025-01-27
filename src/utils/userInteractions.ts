interface UserInteraction {
  event_type: string;
  component: string;
  details?: Record<string, any>;
}

export const logUserInteraction = async (interaction: UserInteraction) => {
  // In GitHub version, we just log to console
  console.log('User interaction:', interaction);
};