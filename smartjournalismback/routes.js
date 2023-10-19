const express = require("express");
const router = express.Router();

const journalist = require("./Journalist/journalistController");
const vnews = require("./News/vnewsController");
const media = require("./Media/mediaController");
const news = require("./News/newsController");
const public = require("./Public/pubController");
const plans = require("./Media/planController");
const critical=require('./critical/criticalController')

//journalist  routes
router.post("/registerJournalist",journalist.upload,journalist.registerJournalist); // ok
router.post("/loginJournalist", journalist.loginJournalist);
router.post("/viewJournalists", journalist.viewJournalists);
router.post("/editJournalistById/:id",journalist.upload,journalist.editJournalistById);
router.post("/addJournalistByMedia/:id", journalist.upload, journalist.addJournalistByMedia); // ok
router.post("/viewJournalistById/:id", journalist.viewJournalistById);
router.post("/viewJournalistByMId/:id", journalist.viewJournalistByMId);
router.post("/viewFreelancerReqs", journalist.viewFreelancerReqs);
router.post("/approveFreelancer/:id", journalist.approveFreelancer);
router.post("/delJournalistById/:id", journalist.delJournalistById);

router.post("/blockFreelancer/:id", journalist.blockFreelancer); // ok
router.post("/unBlockFreelancer/:id", journalist.unBlockFreelancer); // ok
router.post("/viewBlockedJournalists", journalist.viewBlockedJournalists);


router.post("/sendKey/:id", journalist.sendKey);
router.post("/verifyKey/:id", journalist.verifyKey);

router.post("/registerMedia", media.upload, media.registerMedia); 
router.post("/editMediaById/:id", media.upload, media.editMediaById);
router.post("/loginMedia", media.loginMedia);
router.post("/viewMedias", media.viewMedias);
router.post("/viewMediaById/:id", media.viewMediaById);

router.post("/sendKeyMedia/:id", media.sendKey);
router.post("/verifyKeyMedia/:id", media.verifyKey);

router.post("/blockMediaByAdmin/:id", media.blockMediaByAdmin); // journalists of the media???????????????
router.post("/unBlockMediaByAdmin/:id", media.unBlockMediaByAdmin); // ok
router.post("/viewBlockedMedias", media.viewBlockedMedias);


//plans
router.post("/registerPlan", plans.register);
router.post("/viewPlans", plans.viewPlans);
router.post("/viewPlanById/:id", plans.viewPlanById);
router.post("/editPlanById/:id", plans.editPlanById);
router.post("/delPlanById/:id", plans.delPlanById);
router.post("/subscribePlan", plans.subscribePlan);
router.post("/viewSubByMId/:id", plans.viewSubByMId);
router.post("/viewSubByJId/:id", plans.viewSubByJId);

//News  routes
router.post("/addNews", news.upload, news.addNews); //  by any journalist, but should add jid, freelance or not and mid if possible
router.post("/deleteNewsById/:id", news.delNewsById);
router.post("/editNewsById/:id", news.editNewsById);
router.post("/viewNewsById/:id", news.viewNewsById);
router.post("/viewNewsForHome", news.viewNewsForHome);


router.post("/viewNewsByCat/:category", news.viewNewsByCategory);
router.post("/viewNewsByMedia/:id", news.viewNewsByMedia);
router.post("/viewNewsByJournalist/:id", news.viewNewsByJournalist);
router.post("/viewNewsCountById/:id", news.viewNewsCountById);
router.post("/featuredNewses", news.featuredNewses);

router.post("/viewvNewsByMedia/:id", vnews.viewvNewsByMedia);

//video News  routes
router.post("/addvNews", vnews.upload, vnews.addVideoNews);
router.post("/deletevNewsById/:id", vnews.delVNewsById);

router.post("/viewAllNews", news.viewNewses); // view all news

router.post("/viewVideoNewses", vnews.viewVideoNewses); // view all video by freelance // done

router.post("/viewVnewsById/:id", vnews.viewVNewsById); // view all video by media journalist

router.post("/viewVnewsReqs/:mid", vnews.viewVideoNewsReqsforMedia); // view media video requests (media admin should accept)
router.post("/approveVnews/:nid", vnews.updateVNewsByMedia); // approve video req by media journalists - news id
router.post("/addCommentForVNews/:id", vnews.addComment); // ------------new API

router.post("/viewNewsReqMedia/:mid", news.viewNewsReqMedia); // view media news requests - media admin
router.post("/approveNewsByMedia/:nid", news.updateNewsByMedia); // approve media news by id  - media
router.post("/addComment/:id", news.addComment);

router.post("/viewFreelancerNewsReqAdmin", news.viewFreelancerNewsReqAdmin); //view freelance news requests - admin // done
router.post("/approveNewsByAdmin/:id", news.updateNewsByAdmin); // approve freelance news by news id - admin // done
router.post("/viewNewseswithreviews", news.viewNewseswithreviews); 




router.post("/viewFreelancervNewsReqsAdmin",vnews.viewFreelancervNewsReqsByAdmin); // View freelance video requests (admin) // done
router.post("/approveVNewsReqsByAdmin/:id", vnews.approveVNewsReqsByAdmin); // approve freelance video requests (admin) // done

//public routes

router.post("/registerPublic", public.registerPublic);
router.post("/loginPublic", public.login);
router.post("/viewPublic", public.viewPublic);

router.post("/editPublicById/:id", public.editPublicById);
router.post("/viewPublicById/:id", public.viewPublicById);
router.post("/deletePublicById/:id", public.deletePublicById);
router.post("/forgotPwd", public.forgotPassword);
router.post("/sendKeyPublic/:id", public.sendKey);
router.post("/verifyKeyPublic/:id", public.verifyKey);
router.post("/saveNews/:id", public.saveNews);
router.post("/viewSavedNewsByPid/:id", public.viewSavedNewsByPid);
router.post("/deleteSavedNews/:id", public.deleteSavedNews); // -- new APi


router.post("/addIssue/:id",critical.addIssue)
router.post("/viewCriticalIssues",critical.viewCriticalIssues)
router.post("/viewCriticalIssuesByMedia/:id",critical.viewCriticalIssuesByMedia)
router.post("/confirmCriticalIssues/:id",critical.confirmCriticalIssues)

module.exports = router;
