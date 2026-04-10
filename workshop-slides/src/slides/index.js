import Slide01Title from './Slide01Title.jsx'
import Slide02Purpose from './Slide02Purpose.jsx'
import Slide03Agenda from './Slide03Agenda.jsx'
import Slide04SdlcOverview from './Slide04SdlcOverview.jsx'
import {
  SdlcHighlightPlan,
  SdlcHighlightDesign,
  SdlcHighlightDevelop,
  SdlcHighlightTest,
  SdlcHighlightReview,
  SdlcHighlightDeploy,
  SdlcHighlightMonitor,
} from './SlideSdlcHighlight.jsx'
import SlidePlanDeepDive from './SlidePlanDeepDive.jsx'
import SlidePlanPrdExample from './SlidePlanPrdExample.jsx'
import SlidePlanTools from './SlidePlanTools.jsx'
import SlidePlanCursorHelps from './SlidePlanCursorHelps.jsx'
import SlideDesignDeepDive from './SlideDesignDeepDive.jsx'
import SlideDesignSystemFull from './SlideDesignSystemFull.jsx'
import SlideDesignSystem from './SlideDesignSystem.jsx'
import SlideDesignVideo from './SlideDesignVideo.jsx'
import SlideDesignCursorHelps from './SlideDesignCursorHelps.jsx'
import SlideDevelopDeepDive from './SlideDevelopDeepDive.jsx'
import SlideDevelopVideo from './SlideDevelopVideo.jsx'
import SlideTestDeepDive from './SlideTestDeepDive.jsx'
import SlideTestAnalogy from './SlideTestAnalogy.jsx'
import SlideTestCursorHelps from './SlideTestCursorHelps.jsx'
import SlideReviewDeepDive from './SlideReviewDeepDive.jsx'
import SlideReviewWorkflow from './SlideReviewWorkflow.jsx'
import SlideReviewCursorHelps from './SlideReviewCursorHelps.jsx'
import SlideDeployDeepDive from './SlideDeployDeepDive.jsx'
import SlideMonitorDeepDive from './SlideMonitorDeepDive.jsx'
import SlideMonitorInternalUse from './SlideMonitorInternalUse.jsx'
import SlideMonitorCursorHelps from './SlideMonitorCursorHelps.jsx'
import Slide05PreWork from './Slide05PreWork.jsx'
import SlideGitWorkflowDiagram from './SlideGitWorkflowDiagram.jsx'
import Slide06Section1Intro from './Slide06Section1Intro.jsx'
import Slide07Phase1Plan from './Slide07Phase1Plan.jsx'
import SlidePrdExample from './SlidePrdExample.jsx'
import SlideRunProject from './SlideRunProject.jsx'
import Slide08Phase2Design from './Slide08Phase2Design.jsx'

import Slide10Phase4Test from './Slide10Phase4Test.jsx'
import SlideSection1Takeaway from './SlideSection1Takeaway.jsx'
import Slide11Section2Intro from './Slide11Section2Intro.jsx'
import Slide12Section2Step1 from './Slide12Section2Step1.jsx'
import SlideRunOtherProject from './SlideRunOtherProject.jsx'
import SlideS2AddFeature from './SlideS2AddFeature.jsx'
import SlideS2FeatureResult from './SlideS2FeatureResult.jsx'
import SlideSection2Takeaway from './SlideSection2Takeaway.jsx'
import Slide15Section3Intro from './Slide15Section3Intro.jsx'
import Slide16Section3Rules from './Slide16Section3Rules.jsx'
import Slide17Transformation from './Slide17Transformation.jsx'
import SlideSection3Step1 from './SlideSection3Step1.jsx'
import SlideSection3Step2 from './SlideSection3Step2.jsx'
import SlideSection3Takeaway from './SlideSection3Takeaway.jsx'
import Slide19Story from './Slide19Story.jsx'
import Slide20Go from './Slide20Go.jsx'

export const slides = [
  { id: 1, className: 'title-slide', component: Slide01Title },
  { id: 2, component: Slide02Purpose },
  { id: 3, component: Slide03Agenda },
  { id: 4, component: Slide04SdlcOverview },

  // SDLC deep-dive: Plan
  { id: 4.01, component: SdlcHighlightPlan },
  { id: 4.1, component: SlidePlanDeepDive },
  { id: 4.11, component: SlidePlanPrdExample },
  { id: 4.12, component: SlidePlanTools },
  { id: 4.13, component: SlidePlanCursorHelps },

  // SDLC deep-dive: Design
  { id: 4.19, component: SdlcHighlightDesign },
  { id: 4.2, component: SlideDesignDeepDive },
  { id: 4.21, component: SlideDesignSystemFull },
  { id: 4.22, component: SlideDesignSystem },
  { id: 4.23, component: SlideDesignVideo },
  { id: 4.24, component: SlideDesignCursorHelps },

  // SDLC deep-dive: Develop
  { id: 4.29, component: SdlcHighlightDevelop },
  { id: 4.3, component: SlideDevelopDeepDive },
  { id: 4.31, component: SlideDevelopVideo },

  // SDLC deep-dive: Test
  { id: 4.39, component: SdlcHighlightTest },
  { id: 4.4, component: SlideTestDeepDive },
  { id: 4.41, component: SlideTestAnalogy },
  { id: 4.42, component: SlideTestCursorHelps },

  // SDLC deep-dive: Review
  { id: 4.49, component: SdlcHighlightReview },
  { id: 4.5, component: SlideReviewDeepDive },
  { id: 4.52, component: SlideReviewWorkflow },
  { id: 4.53, component: SlideReviewCursorHelps },

  // SDLC deep-dive: Deploy
  { id: 4.59, component: SdlcHighlightDeploy },
  { id: 4.6, component: SlideDeployDeepDive },

  // SDLC deep-dive: Monitor
  { id: 4.69, component: SdlcHighlightMonitor },
  { id: 4.7, component: SlideMonitorDeepDive },
  { id: 4.72, component: SlideMonitorInternalUse },
  { id: 4.73, component: SlideMonitorCursorHelps },

  { id: 5, component: SlideGitWorkflowDiagram },
  { id: 5.5, component: Slide05PreWork },
  { id: 6, component: Slide06Section1Intro },
  { id: 7, component: Slide07Phase1Plan },
  { id: 7.5, component: SlidePrdExample },
  { id: 8, component: Slide08Phase2Design },
  { id: 8.5, component: SlideRunProject },

  { id: 10, component: Slide10Phase4Test },
  { id: 11, component: SlideSection1Takeaway },
  { id: 12, component: Slide11Section2Intro },
  { id: 13, component: Slide12Section2Step1 },
  { id: 13.5, component: SlideRunOtherProject },
  { id: 14, component: SlideS2AddFeature },
  { id: 14.5, component: SlideS2FeatureResult },
  { id: 15, component: SlideSection2Takeaway },
  { id: 17, component: Slide15Section3Intro },
  { id: 18, component: Slide16Section3Rules },
  { id: 19, component: Slide17Transformation },
  { id: 20, component: SlideSection3Step1 },
  { id: 21, component: SlideSection3Step2 },
  { id: 22, component: SlideSection3Takeaway },
  { id: 23, component: Slide19Story },
  { id: 24, className: 'title-slide', component: Slide20Go },
]
