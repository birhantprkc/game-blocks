import { createFileRoute } from '@tanstack/react-router';
import { GameSettingsPage } from '@/components/game/game-settings-page';
import { isGameMode } from '@/components/game/game-storage';

export const Route = createFileRoute('/settings')({
  validateSearch: (search: Record<string, unknown>) => ({
    from: isGameMode(search.from) ? search.from : undefined,
  }),
  component: SettingsPage,
  head: () => ({ meta: [{ title: 'Settings — Super Blocks' }] }),
});

function SettingsPage() {
  const { from } = Route.useSearch();
  return <GameSettingsPage returnMode={from} />;
}
