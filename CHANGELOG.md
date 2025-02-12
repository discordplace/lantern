# Changelog

## [1.3.0](https://github.com/discordplace/lantern/compare/v1.2.0...v1.3.0) (2025-02-12)


### Features

* **ci:** update build workflow to include SSH setup and deployment steps ([454a241](https://github.com/discordplace/lantern/commit/454a2414ead587c71bc76f3c5e6988097c330471))


### Bug Fixes

* **ci:** correct directory path in deployment script ([9ab9103](https://github.com/discordplace/lantern/commit/9ab9103ab890e675110a6ee420d1f0ac184aa47e))
* **ci:** disable command echoing in deployment script ([e18c762](https://github.com/discordplace/lantern/commit/e18c7629f5da72507a21e64d78fe5fa138fb99b4))
* **ci:** enhance deployment script by suppressing command output ([d524b7a](https://github.com/discordplace/lantern/commit/d524b7a2d65bcafd602010cd22025099ac7353d1))
* **ci:** update notification title and body in build workflow ([129b107](https://github.com/discordplace/lantern/commit/129b10719c634327fb98574984ce6d4aaa62be89))
* **ci:** update notification title and body in build workflow ([5872409](https://github.com/discordplace/lantern/commit/5872409a3aef2e615c2d1f7f0e9601777d13fda9))
* **ci:** update SSH setup to use SSH_PRIVATE_KEY instead of GITHUB_TOKEN ([71df2fc](https://github.com/discordplace/lantern/commit/71df2fc913cda56a010d246d686aab42fb039ae9))

## [1.2.0](https://github.com/discordplace/lantern/compare/v1.1.0...v1.2.0) (2025-02-12)


### Features

* **eval:** enhance code evaluation command with improved error handling ([1179f96](https://github.com/discordplace/lantern/commit/1179f96f8153029b6cff746e82aba758a9088e4c))

## [1.1.0](https://github.com/discordplace/lantern/compare/v1.0.1...v1.1.0) (2025-02-04)


### Features

* add safeCall utility function for error handling in async operations ([0dee200](https://github.com/discordplace/lantern/commit/0dee2007e4b7e45008031387954dce38c849071a))
* **presence:** implement last seen tracking for users ([#36](https://github.com/discordplace/lantern/issues/36)) ([cd09bb7](https://github.com/discordplace/lantern/commit/cd09bb735dc0a772965994a33b7012686c373677))
* **svg:** add last seen info to svg cards with option to disable it ([#38](https://github.com/discordplace/lantern/issues/38)) ([8f724da](https://github.com/discordplace/lantern/commit/8f724da073be0945f74d08c707b8a530216f7a77))


### Bug Fixes

* add optional chaining to member presence status checks ([40962cf](https://github.com/discordplace/lantern/commit/40962cf11ebbfe15a38ce4b9d188a654638312d0))
* **commands/eval:** integrate safeCall utility for error handling in awaiting messages ([6d2893b](https://github.com/discordplace/lantern/commit/6d2893b7dbe42dfbbf7ce081a21afac20ab96d26))
* **routes:** update user_id retrieval logic to get user_id from params instead of query ([#28](https://github.com/discordplace/lantern/issues/28)) ([39eb711](https://github.com/discordplace/lantern/commit/39eb711f5204e5c18c9b8194e5f0bf9cd5840356))
* **socket:** update logging category for websocket connection closure ([25163a5](https://github.com/discordplace/lantern/commit/25163a59d67d64aef29aa428137d427746d0b483))
* update interaction command check for improved clarity and type safety ([c8647ec](https://github.com/discordplace/lantern/commit/c8647ec657e12590eeff0cdd1e7b423e39658931))
* update key 'start_human_readable' to 'current_human_readable' for consistency ([371d790](https://github.com/discordplace/lantern/commit/371d790e4732fc395220a307d1ddb54552d6dc56))

## [1.1.0](https://github.com/discordplace/lantern/compare/v1.0.0...v1.1.0) (2025-01-28)


### Features

* add safeCall utility function for error handling in async operations ([0dee200](https://github.com/discordplace/lantern/commit/0dee2007e4b7e45008031387954dce38c849071a))
* **presence:** implement last seen tracking for users ([#36](https://github.com/discordplace/lantern/issues/36)) ([cd09bb7](https://github.com/discordplace/lantern/commit/cd09bb735dc0a772965994a33b7012686c373677))


### Bug Fixes

* add optional chaining to member presence status checks ([40962cf](https://github.com/discordplace/lantern/commit/40962cf11ebbfe15a38ce4b9d188a654638312d0))
* **commands/eval:** integrate safeCall utility for error handling in awaiting messages ([6d2893b](https://github.com/discordplace/lantern/commit/6d2893b7dbe42dfbbf7ce081a21afac20ab96d26))
* **socket:** update logging category for websocket connection closure ([25163a5](https://github.com/discordplace/lantern/commit/25163a59d67d64aef29aa428137d427746d0b483))
* update interaction command check for improved clarity and type safety ([c8647ec](https://github.com/discordplace/lantern/commit/c8647ec657e12590eeff0cdd1e7b423e39658931))
* update key 'start_human_readable' to 'current_human_readable' for consistency ([371d790](https://github.com/discordplace/lantern/commit/371d790e4732fc395220a307d1ddb54552d6dc56))

## 1.0.0 (2024-11-16)


### Bug Fixes

* **routes:** update user_id retrieval logic to get user_id from params instead of query ([#28](https://github.com/discordplace/lantern/issues/28)) ([39eb711](https://github.com/discordplace/lantern/commit/39eb711f5204e5c18c9b8194e5f0bf9cd5840356))
