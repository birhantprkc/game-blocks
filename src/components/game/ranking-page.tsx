import { IconArrowLeft, IconCrown, IconTrophy } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { GAME_COPY } from '@/components/game/game-copy';
import { GamePageFrame } from '@/components/game/game-page-frame';
import { useGamePreferences } from '@/components/game/game-preferences';
import {
  ensureScoreStorageVersion,
  readBestScore,
  readScoreHistory,
  type ScoreRecord,
} from '@/components/game/game-storage';

export function RankingPage() {
  const { preferences } = useGamePreferences();
  const [bestScore, setBestScore] = useState(0);
  const [history, setHistory] = useState<ScoreRecord[]>([]);
  const copy = GAME_COPY[preferences.language];

  useEffect(() => {
    try {
      ensureScoreStorageVersion();
      setBestScore(readBestScore());
      setHistory(readScoreHistory());
    } catch {
      // An empty ranking is a safe fallback when storage is unavailable.
    }
  }, []);

  return (
    <GamePageFrame testId="ranking-page">
      <main className="game-inner-shell">
        <header className="game-inner-header">
          <Link aria-label={copy.backToHome} className="game-round-link" to="/">
            <IconArrowLeft aria-hidden="true" />
          </Link>
          <h1>{copy.ranking}</h1>
          <IconTrophy
            className="game-inner-header-icon trophy"
            aria-hidden="true"
          />
        </header>

        <p className="game-inner-intro">{copy.localRankingDescription}</p>

        <div className="ranking-best-card">
          <IconCrown aria-hidden="true" />
          <span>{copy.yourBest}</span>
          <strong>{bestScore.toLocaleString()}</strong>
        </div>

        {history.length > 0 ? (
          <ol className="standalone-score-list">
            {history.map((entry, index) => (
              <li key={entry.id}>
                <span className="leaderboard-position">{index + 1}</span>
                <span className="ranking-mode-badge">
                  {entry.mode === 'daily' ? copy.daily : copy.classic}
                </span>
                <strong>
                  {entry.mode === 'daily' ? copy.daily : copy.classic}
                </strong>
                <b>{entry.score.toLocaleString()}</b>
              </li>
            ))}
          </ol>
        ) : (
          <section className="standalone-empty-ranking">
            <IconTrophy aria-hidden="true" />
            <p>{copy.localRankingDescription}</p>
          </section>
        )}
      </main>
    </GamePageFrame>
  );
}
