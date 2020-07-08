## A React Native app built to enable The Wave Project Coordinators and volunteers to organise and attend sessions.

### Contributors

Built with pride by:
[Jack Bridger](https://github.com/jackbridger)
&
[Tony Lomax](https://github.com/tonylomax)

### Technology used:

- Redux
- Firebase/Cloud Firestore for database
- Firebase Cloud Functions for serverless functions
- Detox for end to end testing of frontend
- Deployment with fastlane

### To setup the repo:

- git clone https://github.com/TheWaveProject/WaveVolunteerApp.git
- Ensure that simulators are installed for Android and iOS.
- Android SDK needs Google Play Store access to use Firebase.
- For ios `cd ios` and `pod install`
- To run on simulator `npm run ios` or `npm run android`

### Ask Wave team for

- Access to Wave email account (thewaveprojectapp@gmail.com)
- Credentials for Google Play and Apple Developer Portal (subject to subscription)
- Firebase console access

### To deploy new version

- cd ios or cd android
- \$ fastlane beta

### Firebase

- Data and authentication handled by Firebase. Contact The Wave Project for access to Firebase console.
- Reads and writes to Firebase cost money, optimise before adding new requests. 💸 💸

### Fastlane

- Fastlane deployment is set up for iOS and Android beta and live deployment
- Fastfiles are located at the root of iOS and Android project folders respectively.

### Tests - E2E

- E2E tests written in Detox
- View package.json for full list of commands
  To Test:
- Build Android and/or iOS simulators
- Run all or specific tests with command: `detox test -c ios [test name here or blank for all tests]`
- If tests fail check there is sufficient memory on your machine, you may need to run iOS and then androrid tests seperately e.g. by closing one simulator when the other is finished
- Yellow Box warnings may get in the way of test taps/clicks. Add line

```json
console.disableYellowBox = true;
```

to index.js (Remove this line during developement)

### Future Work

- Incorporation of service users/parents including additonal roles/priviledges and access to certain functionality
-

### Gotchas

### FAQ:

- Project takes time to build - on first build it may take up to an hour to build the project on simulator, as long as the build command is still outputting ...... then it's building, so go make a coffee
- How are function and component imports working? Multiple package.json files are used with a single key: pair - name: "" are used. Imports do not need relative path to file location.
- Error along the lines of:
  `Multiple commands produce '/Users/Jack/Library/Developer/Xcode/DerivedData/WaveVolunteerApp-dvdmpuxegxjbhneckjpkqzwfqaym/Build/Products/Debug-iphonesimulator/WaveVolunteerApp.app/gRPCCertificates-Cpp.bundle'`

### What's happening:

Multiple gRPCCertificates being generated.

Duplicate references in project.pbxproj

### Fix:

Go to project.pbxproj

Search for 'grpc'. There should be four sections of code. Effectively two sections have been duplicated.

-WaveProject

-WaveProjectTest

-WaveProject

-WaveProjectTest

Remove two of the code sections so that there are no duplicates.

Example snippet (one section for wavevolunteerapptest):

```ruby
205268B19119787224586B17 /* [CP] Copy Pods Resources */ = {
			isa = PBXShellScriptBuildPhase;
			buildActionMask = 2147483647;
			files = (
			);
			inputPaths = (
				"${PODS_ROOT}/Target Support Files/Pods-WaveVolunteerApp-WaveVolunteerAppTests/Pods-WaveVolunteerApp-WaveVolunteerAppTests-resources.sh",
				"${PODS_CONFIGURATION_BUILD_DIR}/gRPC-C++/gRPCCertificates-Cpp.bundle",
			);
			name = "[CP] Copy Pods Resources";
			outputPaths = (
				"${TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/gRPCCertificates-Cpp.bundle",
			);
			runOnlyForDeploymentPostprocessing = 0;
			shellPath = /bin/sh;
			shellScript = "\"${PODS_ROOT}/Target Support Files/Pods-WaveVolunteerApp-WaveVolunteerAppTests/Pods-WaveVolunteerApp-WaveVolunteerAppTests-resources.sh\"\n";
			showEnvVarsInLog = 0;
		};
```

### Good tutorials

### Algolia

Run in your terminal:
`firebase functions:config:set algolia.appid="" algolia.apikey=""`

To test functions locally with algolia production

`firebase functions:config:get > .runtimeconfig.json`

Then deploy

`firebase emulators:start --only functions`
