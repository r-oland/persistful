type DbEntities =
  | 'users'
  | 'activities'
  | 'rewards'
  | 'days'
  | 'sessions'
  | 'accounts'
  | 'subscriptions';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
