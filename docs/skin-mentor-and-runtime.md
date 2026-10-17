# The Ruination: Skin Mentor and Custom-Skin Workflow

Status: design brief, not a claim that the feature is implemented.

## Product goal

The Ruination should help a first-time skin creator go from an idea to a validated, exportable custom-skin package without needing to already understand League's BIN schemas, animation graphs, WAD layout, texture formats, or packaging conventions.

The feature has two separate responsibilities:

1. **Skin Mentor**: a Copilot-style, context-aware guide for learning and editing.
2. **Custom-skin pipeline**: reliable project creation, asset editing, validation, packaging, and hand-off to a supported custom-skin runtime/manager.

The assistant must not pretend that a generated explanation or code snippet is a working mod. It should show what it knows, what files it used, and which validation steps succeeded.

## Skin Mentor experience

### Entry points

- A persistent **Mentor** panel in the main editor.
- Context actions in BIN, animation, model, texture, VFX, and loadscreen views: Explain this, Help me change this, and Find related files.
- Guided recipes for common goals: pentakill/killstreak animation, arena entrance, recall, taunt/dance, spell VFX, chroma, animated loadscreen, and porting a skin between compatible targets.

### Context sent to the assistant

Only the minimum relevant context should be sent: selected project metadata, selected file paths, detected formats, current diagnostics, and user-selected snippets. Never upload a whole League installation or all project assets by default. Before sending local content to a remote provider, show a clear consent notice and let users disable remote assistance.

### Answers and edits

- Explain the asset chain first, then give a step-by-step workflow for the current project.
- Link to exact files and fields, and explain what each field controls.
- Prefer small, reviewable patches over rewriting an entire BIN.
- Show a diff before applying any generated change.
- Create a project checkpoint before writes; require explicit approval to apply changes.
- Run relevant parsers, project audits, reference checks, and package validation after changes. Report failures instead of claiming success.
- If the project does not contain enough evidence to answer, ask for the champion/skin, intended event, and relevant files rather than inventing hashes or schema fields.

### Starter recipe: custom animation/event

1. Identify the target champion/skin and the event to replace.
2. Locate the relevant animation assets and animation-related BIN/state graph using local hash/path resolution.
3. Verify the candidate animation's skeleton/rig compatibility and required animation names.
4. Trace the event/state references before changing them; do not guess unknown hash values.
5. Make a checkpoint, edit the smallest required set of files, and show the diff.
6. Validate BIN parsing, references, missing assets, and package contents.
7. Preview the result where the current renderer supports it; otherwise explicitly label the preview as unavailable.
8. Export a mod package and offer the configured manager hand-off.

Pentakill animation and arena entrance are user goals, not guaranteed one-file edits. The Mentor should explain when the event is controlled by a game state, animation graph, VFX, or client-side behavior that a skin package cannot safely replace on its own.

## Provider and privacy model

- Support a user-configured OpenAI-compatible endpoint/model, with a local/offline rules-and-docs mode when no provider is configured.
- Store credentials in the OS credential store, not project JSON, logs, source files, or exported mod packages.
- Make endpoint, model, context-sharing, and usage controls visible in Settings.
- Apply timeouts, response-size limits, and safe Markdown rendering. Treat model output as untrusted text, never as executable shell commands.
- Do not silently send files or make network calls. Show the selected context and request consent before remote submission.

## Custom-skin workflow and runtime boundary

The application should own the asset workflow: discover/read WAD assets, create a project, edit supported files, audit references, checkpoint changes, and export valid .fantome/.modpkg packages. The current README describes hand-off to supported managers such as Celestial and LTK Manager.

A package editor is not itself a runtime loader. Do not inject code into the League process or modify the live client to force-load a skin. Instead:

- Detect supported installed managers and their documented integration paths.
- Validate the package before hand-off.
- Show the exact destination and ask for confirmation before syncing.
- If no supported manager is available, export the package and link to setup instructions.
- Clearly distinguish exported, handed off, and confirmed active; never claim a skin is running just because a file was written.

## Suggested implementation order

1. **Brand and build hygiene**: remove accidental old product identifiers, verify Rust crate/import consistency, run frontend checks, Rust tests, and package workflows.
2. **Workflow truthfulness**: audit the existing create/edit/validate/export/manager hand-off path and add end-to-end tests for package output.
3. **Mentor v1 (offline)**: indexed documentation, file-format explanations, guided recipes, and project diagnostics with citations to local files/docs.
4. **Mentor v2 (provider-backed)**: optional OpenAI-compatible model, credential storage, privacy controls, context selection, and streaming answers.
5. **Safe edit loop**: proposed patch/diff, checkpoint, user approval, format validation, and rollback.
6. **Animation/VFX recipes**: implement each recipe against real sample projects and regression fixtures; do not mark a recipe complete until a package has passed validation.
7. **Runtime hand-off**: integration tests for each supported manager and clear user-facing status.

## Acceptance criteria

- A beginner can choose a recipe and understand which assets matter and why.
- The assistant references actual project files or local docs for technical claims.
- Generated edits are never applied without an explicit review/approval step.
- A failed parse, missing reference, or invalid package is visible and blocks a ready status.
- A valid export can be handed off through a supported manager without manually moving files.
- No feature claims to activate a skin unless the configured manager confirms the hand-off status.
- Build, tests, and end-to-end package validation are green before the feature is described as working.
