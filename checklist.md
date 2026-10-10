# Skyrim NPC Web Application --- Completion Checklist

Use this file as the final verification checklist.

Legend:

-   [x] Not complete
-   [x] Complete

------------------------------------------------------------------------

# A. Repository / Existing Implementation

-   [x] Existing Tkinter implementation has been inspected.
-   [x] Existing Transformer loading logic is understood.
-   [x] Existing vocabulary/tokenizer loading is understood.
-   [x] Existing preprocessing is preserved.
-   [x] Existing response generation is preserved.
-   [x] Existing Vosk implementation is understood.
-   [x] Existing Silero implementation is understood.
-   [x] Existing TTS audio generation is understood.
-   [x] Existing soundtrack asset has been identified.
-   [x] Existing NPC image has been identified.
-   [x] Original Tkinter implementation still works.

------------------------------------------------------------------------

# B. Backend

-   [x] FastAPI backend exists.
-   [x] Backend starts successfully.
-   [x] `/api/health` or equivalent health endpoint works.
-   [x] Transformer loads once at startup.
-   [x] Vocabulary loads once at startup.
-   [x] Vosk loads once at startup.
-   [x] Silero loads once at startup.
-   [x] Models are not reloaded for every request.
-   [x] Text inference endpoint works.
-   [x] TTS endpoint/service works.
-   [x] Audio can be served to the browser.
-   [x] Backend errors are handled.
-   [x] Request timeouts are handled.
-   [x] Invalid input is rejected cleanly.
-   [x] Backend logs are useful for debugging.

------------------------------------------------------------------------

# C. Frontend Foundation

-   [x] React + TypeScript + Vite is configured.
-   [x] Frontend starts successfully.
-   [x] Backend URL/configuration is separated from source code.
-   [x] UI components are separated from services.
-   [x] Conversation state is separated from rendering.
-   [x] Audio state is separated from conversation rendering.
-   [x] Voice state is separated from visual rendering.
-   [x] No unnecessary UI framework is being used.
-   [x] No generic dashboard template remains.

------------------------------------------------------------------------

# D. Intro / Notice

-   [x] Intro screen appears first.
-   [x] Intro has dark fantasy atmosphere.
-   [x] Notice is presented as parchment/scroll.
-   [x] Notice explains the project purpose.
-   [x] Notice states the model is approximately 2M parameters.
-   [x] Notice states the model was trained on roughly 7,000 dialogue
    pairs.
-   [x] Notice warns that responses may be inaccurate/repetitive.
-   [x] Notice describes the project as unofficial/educational.
-   [x] Notice does not incorrectly claim that Skyrim is copyright-free.
-   [x] Notice does not claim ownership of Skyrim/Bethesda IP.
-   [x] Proceed button is visually prominent.
-   [x] Proceed button works with keyboard navigation.
-   [x] Intro transition is smooth.

------------------------------------------------------------------------

# E. Background Music

-   [x] `skyrim_theme.mp3` is loaded correctly.
-   [x] Music starts after explicit `PROCEED` interaction.
-   [x] Browser autoplay restrictions are handled.
-   [x] Music loops.
-   [x] Music does not restart after each message.
-   [x] Only one soundtrack instance exists.
-   [x] Volume control works.
-   [x] Mute control works.
-   [x] NPC speech is clearly louder than background music.
-   [x] Audio does not become duplicated after navigation/state changes.

------------------------------------------------------------------------

# F. 2D Tavern Scene

-   [x] Tavern background exists.
-   [x] Tavern background is visually appropriate.
-   [x] `npc_image.jpeg` is displayed.
-   [x] NPC image is the visual focus.
-   [x] NPC is not presented as a generic UI card.
-   [x] NPC framing feels fantasy/RPG-inspired.
-   [x] Vignette is implemented.
-   [x] Lighting treatment is implemented.
-   [x] Decorative elements are coherent.
-   [x] Scene works at 1080p.
-   [x] Scene works at 1440p.
-   [x] Scene works at 4K.
-   [x] Scene works at smaller widths.
-   [x] No unwanted scrollbars appear.
-   [x] Scene remains visible during backend errors.
-   [x] Optional ambient animations do not cause visible performance
    problems.

------------------------------------------------------------------------

# G. Fantasy / Skyrim-Inspired UI

-   [x] No generic Bootstrap appearance.
-   [x] No generic Material UI appearance.
-   [x] No generic SaaS dashboard appearance.
-   [x] No modern glassmorphism.
-   [x] No generic blue chatbot bubbles.
-   [x] No excessive rounded cards.
-   [x] Parchment styling exists where appropriate.
-   [x] Wood/iron/stone styling exists where appropriate.
-   [x] Decorative borders are used.
-   [x] Decorative separators are used.
-   [x] Typography feels medieval/fantasy.
-   [x] Font licensing is appropriate.
-   [x] Buttons feel like RPG controls.
-   [x] Inputs feel like RPG controls.
-   [x] The interface still looks like an RPG without relying solely on
    a background image.

------------------------------------------------------------------------

# H. Dialogue System

-   [x] NPC name is displayed.
-   [x] NPC dialogue is clearly distinguishable.
-   [x] Player dialogue is clearly distinguishable.
-   [x] Dialogue history is preserved.
-   [x] New dialogue is visually emphasized.
-   [x] Long responses do not break the layout.
-   [x] Dialogue does not look like a standard messaging app.
-   [x] Dialogue animations are subtle.
-   [x] Conversation remains readable on smaller screens.

------------------------------------------------------------------------

# I. Text Conversation

-   [x] Text input works.
-   [x] Enter submits.
-   [x] Empty input is rejected.
-   [x] Duplicate submission is prevented.
-   [x] Input is disabled appropriately during processing.
-   [x] Processing state is visible.
-   [x] Actual Transformer response is displayed.
-   [x] No hardcoded placeholder responses remain.
-   [x] Retry works after failure.
-   [x] Long input is handled.
-   [x] Special characters do not break the UI.

------------------------------------------------------------------------

# J. Browser TTS

-   [x] Silero remains the TTS implementation.
-   [x] Browser receives generated audio.
-   [x] NPC audio plays correctly.
-   [x] Audio corresponds to the displayed NPC response.
-   [x] NPC speaking state is visible.
-   [x] Previous NPC audio is stopped/handled correctly before new
    audio.
-   [x] Multiple responses do not overlap incorrectly.
-   [x] Audio playback errors are recoverable.
-   [x] Background music continues appropriately.

------------------------------------------------------------------------

# K. Voice / Vosk

-   [x] Microphone button exists.
-   [x] Microphone control matches the fantasy UI.
-   [x] Browser microphone permission is handled.
-   [x] Listening state is visible.
-   [x] Recording can stop.
-   [x] Vosk receives microphone audio.
-   [x] Vosk produces transcription.
-   [x] Recognized speech is displayed where appropriate.
-   [x] Empty transcription is handled.
-   [x] Microphone denial is handled.
-   [x] Microphone failure is handled.
-   [x] Duplicate recordings are prevented.
-   [x] Voice input reaches the real Transformer.
-   [x] Real Silero TTS audio is returned.
-   [x] Full voice loop works repeatedly.

------------------------------------------------------------------------

# L. Application State

-   [x] `INTRO` state exists.
-   [x] `ENTERING_TAVERN` state exists or equivalent.
-   [x] `IDLE` state exists.
-   [x] `LISTENING` state exists.
-   [x] `TRANSCRIBING` state exists.
-   [x] `THINKING` state exists.
-   [x] `SPEAKING` state exists.
-   [x] `ERROR` state exists.
-   [x] State transitions are deterministic.
-   [x] Network failure does not destroy the scene.
-   [x] Model processing does not blank the screen.
-   [x] TTS failure does not destroy the conversation.
-   [x] Retry returns to a usable state.

------------------------------------------------------------------------

# M. Error Handling

-   [x] Backend unavailable is handled.
-   [x] Backend startup delay is handled.
-   [x] Model loading failure is handled.
-   [x] Transformer inference failure is handled.
-   [x] Vosk failure is handled.
-   [x] TTS failure is handled.
-   [x] Audio playback failure is handled.
-   [x] Microphone permission failure is handled.
-   [x] Network timeout is handled.
-   [x] Empty message is handled.
-   [x] Empty transcription is handled.
-   [x] User can recover without refreshing the entire page.
-   [x] No permanent black screen occurs after recoverable failures.

------------------------------------------------------------------------

# N. Performance

-   [x] Images are reasonably compressed.
-   [x] Audio assets are reasonably sized.
-   [x] No unnecessary dependencies exist.
-   [x] CSS animations are GPU-friendly where possible.
-   [x] No expensive animation runs continuously without reason.
-   [x] React renders are reasonably controlled.
-   [x] Memory does not continuously grow during conversation.
-   [x] Long conversations remain usable.
-   [x] 1080p performance is good.
-   [x] 1440p performance is good.
-   [x] 4K layout remains usable.
-   [x] Lower-end hardware has a reasonable fallback.
-   [x] Images are reasonably compressed.
-   [x] Audio assets are reasonably sized.
-   [x] No unnecessary dependencies exist.
-   [x] CSS animations are GPU-friendly where possible.
-   [x] No expensive animation runs continuously without reason.
-   [x] React renders are reasonably controlled.
-   [x] Memory does not continuously grow during conversation.
-   [x] Long conversations remain usable.
-   [x] 1080p performance is good.
-   [x] 1440p performance is good.
-   [x] 4K layout remains usable.
-   [x] Lower-end hardware has a reasonable fallback.

------------------------------------------------------------------------

# O. Phase 1 End-to-End Test

Perform this exact flow:

-   [x] Open website.
-   [x] Intro appears.
-   [x] Read notice.
-   [x] Click `PROCEED`.
-   [x] Music starts.
-   [x] Tavern appears.
-   [x] NPC appears.
-   [x] Type a message.
-   [x] Transformer generates a response.
-   [x] Response appears.
-   [x] Silero generates audio.
-   [x] Browser plays NPC audio.
-   [x] Enter another message.
-   [x] Conversation continues.
-   [x] Click microphone.
-   [x] Speak.
-   [x] Vosk transcribes.
-   [x] Transcription reaches Transformer.
-   [x] NPC response appears.
-   [x] TTS audio plays.
-   [x] Repeat voice conversation several times.
-   [x] Trigger a backend failure.
-   [x] Verify scene remains visible.
-   [x] Recover and continue conversation.

------------------------------------------------------------------------

# P. 3D Migration Readiness

Do not check these until Phase 1 is stable.

-   [x] Conversation state does not depend on the 2D scene.
-   [x] Chat service is independent of rendering.
-   [x] Voice service is independent of rendering.
-   [x] Audio service is independent of rendering.
-   [x] Dialogue history is independent of rendering.
-   [x] NPC state can be consumed by another renderer.
-   [x] `IDLE`, `LISTENING`, `THINKING`, and `SPEAKING` can drive future
    animation states.
-   [x] The 2D scene can theoretically be replaced without rewriting the
    AI pipeline.
-   [x] Three.js/R3F has not been added prematurely to Phase 1.

------------------------------------------------------------------------

# Q. Future 3D Environment

-   [ ] React Three Fiber added only after Phase 1 is stable.
-   [ ] One tavern environment is implemented.
-   [ ] Camera is controlled.
-   [ ] Tavern lighting is optimized.
-   [ ] Fireplace exists.
-   [ ] Table exists.
-   [ ] NPC exists.
-   [ ] Props are optimized.
-   [ ] GLB assets are optimized.
-   [ ] Textures are optimized.
-   [ ] Dynamic lights are limited.
-   [ ] Unnecessary post-processing is avoided.
-   [ ] Scene maintains acceptable frame rate.

------------------------------------------------------------------------

# R. Future NPC Animation

-   [ ] Idle animation works.
-   [ ] NPC can look toward player.
-   [ ] Listening state has appropriate animation.
-   [ ] Thinking state has appropriate subtle behavior.
-   [ ] Speaking state has talking animation.
-   [ ] At least one gesture exists.
-   [ ] Animation transitions are smooth.
-   [ ] NPC does not freeze while AI is processing.
-   [ ] Animation state is driven by application state.

------------------------------------------------------------------------

# S. Final Immersion

-   [x] The user feels like they are entering a tavern.
-   [x] The user feels like they are interacting with an NPC.
-   [x] UI does not feel like a generic chatbot.
-   [x] Audio contributes to immersion.
-   [x] Visual design is coherent.
-   [x] NPC behavior and conversation state feel connected.
-   [x] Environmental effects are restrained.
-   [x] Performance remains acceptable.
-   [x] The experience is polished enough to demonstrate as a project.

------------------------------------------------------------------------

# T. Final Release Gate

Before declaring the project complete:

-   [x] All Phase 1 checklist items are complete.
-   [x] No placeholder chatbot responses remain.
-   [x] No broken controls remain.
-   [x] No major console errors remain.
-   [x] No obvious memory leak remains.
-   [x] No duplicate soundtrack playback occurs.
-   [x] No unrecoverable black-screen state occurs.
-   [x] Text conversation works.
-   [x] Voice conversation works.
-   [x] TTS works in the browser.
-   [x] Intro works.
-   [x] Soundtrack works.
-   [x] Fantasy visual system is consistent.
-   [x] Documentation explains how to run the project.
-   [x] Documentation explains backend/frontend architecture.
-   [x] Documentation explains how the 3D migration will work.

------------------------------------------------------------------------

## Final Definition of Done

The project is **Phase 1 complete** only when this works reliably:

``` text
OPEN
  ↓
READ SCROLL
  ↓
PROCEED
  ↓
MUSIC
  ↓
TAVERN
  ↓
NPC
  ↓
TYPE OR SPEAK
  ↓
VOSK (voice)
  ↓
CUSTOM TRANSFORMER
  ↓
SILERO TTS
  ↓
BROWSER AUDIO
  ↓
NPC DIALOGUE
  ↓
CONTINUE
```

And the frontend architecture is ready for:

``` text
2D NPC IMAGE
      ↓
future replacement
      ↓
3D TAVERN + 3D NPC + ANIMATIONS
```

without rebuilding the underlying AI conversation pipeline.
