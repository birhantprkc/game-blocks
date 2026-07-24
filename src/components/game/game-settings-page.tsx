import {
  IconArrowLeft,
  IconBulb,
  IconDeviceMobile,
  IconInfoCircle,
  IconLanguage,
  IconMusic,
  IconSparkles,
  IconVolume,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { GAME_COPY } from '@/components/game/game-copy';
import { GamePageFrame } from '@/components/game/game-page-frame';
import {
  type GamePreferences,
  useGamePreferences,
} from '@/components/game/game-preferences';
import type { GameMode } from '@/components/game/game-storage';

type BooleanPreference = Exclude<keyof GamePreferences, 'language'>;

export function GameSettingsPage({ returnMode }: { returnMode?: GameMode }) {
  const { preferences, updatePreference } = useGamePreferences();
  const copy = GAME_COPY[preferences.language];
  const rows: Array<{
    description: string;
    icon: typeof IconVolume;
    key: BooleanPreference;
    label: string;
  }> = [
    {
      description: copy.musicDescription,
      icon: IconMusic,
      key: 'music',
      label: copy.music,
    },
    {
      description: copy.soundDescription,
      icon: IconVolume,
      key: 'sound',
      label: copy.sound,
    },
    {
      description: copy.vibrationDescription,
      icon: IconDeviceMobile,
      key: 'haptics',
      label: copy.vibration,
    },
    {
      description: copy.hintsDescription,
      icon: IconBulb,
      key: 'hints',
      label: copy.hints,
    },
    {
      description: copy.reduceMotionDescription,
      icon: IconSparkles,
      key: 'reducedMotion',
      label: copy.reduceMotion,
    },
  ];

  return (
    <GamePageFrame testId="game-settings-page">
      <main className="game-inner-shell">
        <header className="game-inner-header">
          <Link
            aria-label={returnMode ? copy.backToGame : copy.backToHome}
            className="game-round-link"
            params={returnMode ? { mode: returnMode } : undefined}
            to={returnMode ? '/play/$mode' : '/'}
          >
            <IconArrowLeft aria-hidden="true" />
          </Link>
          <h1>{copy.settings}</h1>
          <IconSparkles className="game-inner-header-icon" aria-hidden="true" />
        </header>

        <p className="game-inner-intro">{copy.settingsIntro}</p>

        <section
          className="game-settings-section"
          aria-labelledby="language-heading"
        >
          <div className="game-settings-title">
            <IconLanguage aria-hidden="true" />
            <div>
              <h2 id="language-heading">{copy.language}</h2>
              <p>{copy.languageDescription}</p>
            </div>
          </div>
          <fieldset
            className="game-language-picker"
            aria-labelledby="language-heading"
          >
            <button
              aria-pressed={preferences.language === 'en'}
              onClick={() => updatePreference('language', 'en')}
              type="button"
            >
              <span>EN</span>
              <strong>English</strong>
            </button>
            <button
              aria-pressed={preferences.language === 'zh'}
              onClick={() => updatePreference('language', 'zh')}
              type="button"
            >
              <span>中</span>
              <strong>中文</strong>
            </button>
          </fieldset>
        </section>

        <section
          className="game-settings-section"
          aria-labelledby="preferences-heading"
        >
          <div className="game-settings-title">
            <IconSparkles aria-hidden="true" />
            <div>
              <h2 id="preferences-heading">{copy.preferences}</h2>
              <p>{copy.settingsDescription}</p>
            </div>
          </div>
          <div className="game-settings-list">
            {rows.map((row) => {
              const Icon = row.icon;
              return (
                <button
                  aria-pressed={preferences[row.key]}
                  className="game-setting-row"
                  key={row.key}
                  onClick={() =>
                    updatePreference(row.key, !preferences[row.key])
                  }
                  type="button"
                >
                  <span className="game-setting-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span className="game-setting-copy">
                    <strong>{row.label}</strong>
                    <small>{row.description}</small>
                  </span>
                  <span
                    className={
                      preferences[row.key] ? 'game-toggle is-on' : 'game-toggle'
                    }
                  >
                    <span />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="game-settings-section game-source-notice">
          <div className="game-settings-title">
            <IconInfoCircle aria-hidden="true" />
            <div>
              <h2>
                {preferences.language === 'zh' ? '资源说明' : 'Asset notice'}
              </h2>
              <p>
                {preferences.language === 'zh'
                  ? '部分游戏音频来自公开可获取的应用资源，仅用于学习和研究；如有侵权请联系删除。'
                  : 'Some game audio was sourced from publicly obtainable app assets for learning and research. Contact us for removal if needed.'}
              </p>
            </div>
          </div>
        </section>
      </main>
    </GamePageFrame>
  );
}
