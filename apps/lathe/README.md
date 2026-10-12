# Lathe website entry

Added October 12, 2026 from the local Apple project `vinylplayer`.

Routes: `app.html?id=lathe`, `privacy.html?id=lathe`, `terms.html?id=lathe`.
Support: `support.html` and `team@rezonating.app`.

The registry supplies the homepage card, navigation, card entrances, and animated galaxy.

## Assets

The active icon is an unchanged copy of
`vinylplayer/Assets.xcassets/AppIcon.appiconset/AppIcon.png`.
Accent `#FF3B63` matches `Player/AppTheme.swift` (Music Pink).
Six English iPhone screenshots are copied unchanged, in manifest order, from
`AppStore/Screenshots-2026-10-10/en-US/iphone/`:

1. `01-drop-the-needle.png`
2. `02-rediscover-your-records.png`
3. `03-press-it-your-way.png`
4. `04-set-the-mood.png`
5. `05-pick-your-dream-deck.png`
6. `06-curate-your-wall.png`

The screenshot manifest identifies these as marketing composites based on simulator
captures. They predate the October 11 Lathe Pro split; website copy and legal terms
follow the current implementation rather than treating screenshot previews as free unlocks.

## Availability and source evidence

An authenticated App Store Connect read on October 12 confirmed app `6820155178`,
version 1.0, is in `PREPARE_FOR_SUBMISSION`. The website therefore says Coming soon
and leaves `appStoreUrl` empty. Recheck the public storefront at release and set
`https://apps.apple.com/us/app/id6820155178?l=en-US` once it is available.

Product and legal copy were written from current source:
`Views/LathePrivacyView.swift`, `Music/AppleMusicProvider.swift`,
`Music/LocalMusicProviders.swift`, `Player/ProFeature.swift`,
`Player/SubscriptionStore.swift`, `Player/RecordCollectionStore.swift`,
`Player/AppSettings.swift`, `Player/PlayerStore.swift`,
`Player/LiveActivityController.swift`, `Player/RecordLook.swift`,
`Views/PhotoFrames.swift`, and `PrivacyInfo.xcprivacy`.
Music browsing/playback is free; Pro is a non-consumable for app-owned features.
Optional listening history defaults off and remains local.

External references checked October 12:

- https://www.revenuecat.com/docs/platform-resources/apple-platform-resources/apple-app-privacy
- https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

Policies use the shared JSON renderer. Keep them aligned with future implementation
and service changes. This addition does not edit the app project or App Store Connect.
