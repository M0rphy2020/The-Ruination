import React, { useMemo, useState } from 'react';
import { Button } from '../ui/Button';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../ui';
import { useModalStore } from '../../lib/stores';

type Topic = 'penta' | 'arena' | 'vfx' | 'bin' | 'skin';

const TOPICS: { id: Topic; title: string; subtitle: string }[] = [
  { id: 'penta', title: 'Pentakill animation', subtitle: 'A custom celebration after a pentakill' },
  { id: 'arena', title: 'Arena entrance', subtitle: 'Champion intro / round-start presentation' },
  { id: 'vfx', title: 'VFX and particles', subtitle: 'Change trails, impacts, colors and emitters' },
  { id: 'bin', title: 'BIN scripting', subtitle: 'Understand and safely edit game data' },
  { id: 'skin', title: 'Make a skin playable', subtitle: 'Turn project files into an importable mod' },
];

const GUIDES: Record<Topic, { goal: string; steps: string[]; files: string[]; warning: string; starter: string }> = {
  penta: {
    goal: 'A pentakill celebration is usually a chain of existing animation/VFX assets plus event or gameplay integration. Editing a model animation alone does not make the game trigger it.',
    steps: [
      'Start from a working champion skin project and create a checkpoint before editing.',
      'Use the WAD Explorer to find the champion’s animation and BIN assets. Compare the base skin with a known working skin that has a similar celebration.',
      'Inspect animation names and references first. Identify whether the effect is driven by an animation, a spell/event listener, a VFX system, or a client-side feature.',
      'Prototype one asset change at a time and preview the animation/model before packaging.',
      'Test in a permitted custom-game/mod setup. If the client never emits the required event, an asset-only mod cannot add the trigger by itself.',
    ],
    files: ['Champion .bin files that reference animation/VFX', 'Animation assets and skeleton compatibility', 'Referenced .troy / particle assets and textures'],
    warning: 'There is no universal “pentakill animation file”. The trigger can depend on client logic that a skin package cannot change.',
    starter: '// Investigation checklist\n// Champion: <champion>\n// Target event: Pentakill\n// Existing animation reference: <name>\n// Required VFX references: <list>\n// Trigger source confirmed? yes/no\n// Test result: <notes>',
  },
  arena: {
    goal: 'An Arena entrance can involve map/UI scripting and champion-specific assets. First determine whether the entrance is a supported asset hook or a client-controlled sequence.',
    steps: [
      'Choose the exact mode and champion; the same visual may be wired differently between modes.',
      'Browse the relevant WADs and search BINs for entrance, intro, spawn, and animation references.',
      'Compare a working entrance with the target champion and list the referenced assets.',
      'Replace or repath assets while preserving skeleton, animation naming, and BIN types.',
      'Export a test package and verify in the supported environment. If a client event or game code triggers the sequence, assets alone will not create a new trigger.',
    ],
    files: ['Mode/UI BINs that reference the sequence', 'Champion animation and skeleton assets', 'Referenced VFX, textures and sounds'],
    warning: 'The tool can help inspect and replace assets, but it cannot promise to add a new game event where the client has no asset hook.',
    starter: '// Entrance investigation\n// Mode: Arena\n// Champion: <champion>\n// Working reference sequence: <asset path>\n// Target animation: <name>\n// Missing event/hook: <unknown or confirmed>',
  },
  vfx: {
    goal: 'VFX edits are usually a combination of particle emitters in BIN data and referenced textures/materials. A good workflow keeps the reference graph intact.',
    steps: [
      'Open the project BIN in the BIN editor and use its VFX/emitter tools rather than blindly editing unknown fields.',
      'Find the emitter and trace its texture/material references.',
      'Change one property at a time, save, and compare against the original BIN.',
      'Keep distortion/normal maps intact when recoloring and preserve alpha channels.',
      'Run project checks and export only after missing references are resolved.',
    ],
    files: ['BIN emitter definitions', 'Referenced textures/materials', 'Particle assets and linked resources'],
    warning: 'Unknown BIN fields can be patch-sensitive. Check the file and keep a checkpoint before bulk edits.',
    starter: '// VFX change plan\n// Emitter: <name/hash>\n// Property to change: <color/scale/rate/etc.>\n// Texture/material reference: <path>\n// Original value: <value>\n// Desired value: <value>',
  },
  bin: {
    goal: 'BIN files describe structured game data. Read the surrounding object and references before changing values; valid syntax does not guarantee valid game behavior.',
    steps: [
      'Open the BIN in The Ruination’s BIN editor and convert/view ritobin text.',
      'Use search and unhash tools to identify the object and its references.',
      'Check the expected field type and compare a known working asset from the same patch.',
      'Make a minimal edit, save, then run project audit/checks.',
      'If the game ignores the change, verify the asset path, hash/reference, type and whether the client actually reads that field.',
    ],
    files: ['The target .bin', 'Referenced assets or linked BINs', 'A known-good comparison from the same patch'],
    warning: 'Never assume a field name or value is valid just because it looks plausible. Use a working reference.',
    starter: '// BIN edit notes\n// File: <path>\n// Object path: <object>\n// Field: <field>\n// Expected type: <type>\n// Reference asset: <known-good path>\n// Validation: <audit/test result>',
  },
  skin: {
    goal: 'The reliable pipeline is project → validate references → export a supported mod package → import it with a compatible custom-skin loader. This editor is not itself a live-game injector.',
    steps: [
      'Create/open the champion project and make your changes.',
      'Run the project audit and fix missing files/references before export.',
      'Use Export to create a .fantome or .modpkg package.',
      'Use the supported launcher integration, such as the configured Celestial or LTK Manager path, if installed and compatible.',
      'Test after game patches and keep the source project so you can repair/re-export it.',
    ],
    files: ['Project asset tree', 'Mod metadata and champion target', 'Exported .fantome or .modpkg package'],
    warning: 'Custom skins can break after patches and may be restricted by Riot’s rules or anti-cheat. Use only supported community workflows; never modify anti-cheat or bypass protections.',
    starter: '// Release checklist\n// Champion / skin target: <target>\n// Project audit: pass/fail\n// Missing references: 0 required\n// Package: .fantome / .modpkg\n// Loader: <supported launcher>\n// Patch tested: <version>',
  },
};

export const CreatorCopilotModal: React.FC = () => {
  const closeModal = useModalStore((s) => s.closeModal);
  const [topic, setTopic] = useState<Topic>('penta');
  const [copied, setCopied] = useState(false);
  const guide = useMemo(() => GUIDES[topic], [topic]);

  const copyStarter = async () => {
    try {
      await navigator.clipboard.writeText(guide.starter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Modal open onClose={closeModal} size="large" modifier="creator-copilot">
      <ModalHeader title="Creator Copilot" onClose={closeModal}>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Beginner-friendly skin workflow guide</span>
      </ModalHeader>
      <ModalBody style={{ display: 'grid', gridTemplateColumns: 'minmax(190px, 0.8fr) minmax(0, 1.7fr)', gap: 20, maxHeight: '72vh', overflow: 'auto' }}>
        <nav aria-label="Creator topics" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TOPICS.map(item => (
            <button key={item.id} type="button" onClick={() => { setTopic(item.id); setCopied(false); }} aria-pressed={topic === item.id}
              style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 8, border: `1px solid ${topic === item.id ? 'var(--accent-primary)' : 'var(--border)'}`, background: topic === item.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <span style={{ display: 'block', fontWeight: 650, marginBottom: 4 }}>{item.title}</span>
              <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.45 }}>{item.subtitle}</span>
            </button>
          ))}
        </nav>
        <article style={{ minWidth: 0, color: 'var(--text-primary)' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{TOPICS.find(item => item.id === topic)?.title}</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 18px' }}>{guide.goal}</p>
          <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Suggested workflow</h3>
          <ol style={{ paddingLeft: 22, margin: '0 0 18px', lineHeight: 1.65 }}>
            {guide.steps.map((step, index) => <li key={index} style={{ paddingLeft: 4, marginBottom: 7 }}>{step}</li>)}
          </ol>
          <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>Assets to inspect</h3>
          <ul style={{ paddingLeft: 22, margin: '0 0 18px', lineHeight: 1.6 }}>
            {guide.files.map(file => <li key={file}>{file}</li>)}
          </ul>
          <div style={{ borderLeft: '3px solid var(--accent-primary)', background: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '0 6px 6px 0', lineHeight: 1.5, fontSize: 13 }}>
            <strong>Reality check:</strong> {guide.warning}
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, margin: 0 }}>Starter notes</h3>
              <Button variant="secondary" size="sm" onClick={copyStarter}>{copied ? 'Copied' : 'Copy template'}</Button>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 14, borderRadius: 8, background: 'var(--bg-primary)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }}>{guide.starter}</pre>
          </div>
        </article>
      </ModalBody>
      <ModalFooter>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Offline guide for now. No AI API key or external service is required.</span>
        <Button variant="primary" onClick={closeModal}>Done</Button>
      </ModalFooter>
    </Modal>
  );
};
