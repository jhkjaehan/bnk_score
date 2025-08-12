package com.bnksc.common.web;

import com.bnksc.common.service.CommonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Controller
public class CommonController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="commonService")
    private CommonService commonService;

    @RequestMapping(value="/common/selectCounselorList.do")
    public String getCounselorList(@RequestParam Map<String, Object> params, Model model) {

        try {
            List<Map<String, Object>> counselorList = commonService.selectCounselorList(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", counselorList);
            model.addAttribute("totalCount", counselorList.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectMstrScore.do")
    public String selectMstrScore(@RequestParam Map<String, Object> params, Model model) {
        log.debug("params ::: ",params);

        try {
            List<Map<String, Object>> mstrScore = commonService.selectMstrScore(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", mstrScore);
            model.addAttribute("totalCount", mstrScore.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectMstrContentList.do")
    public String selectMstrContentList(@RequestParam Map<String, Object> params, Model model) {

        try {
            List<Map<String, Object>> mstrContentList = commonService.selectMstrContentList(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", mstrContentList);
            model.addAttribute("totalCount", mstrContentList.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectMstrConversation.do")
    public String selectMstrConversation(@RequestParam Map<String, Object> params, Model model) {
        try {
            String taskId = (String) params.get("taskId");
            String callId = (String) params.get("callId");

            // 서비스 호출
            Object result = commonService.readConversation(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectCallChartData.do")
    public String selectCallChartData(@RequestParam Map<String, Object> params, Model model) {
        try {
            // 서비스 호출
            model.addAttribute("status", "success");

            Object callChartData = commonService.selectCallChartData(params);
            Object scoreChartData = commonService.selectScoreChartData(params);
            Object problemChartData = commonService.selectProblemChartData(params);

            model.addAttribute("callChartData", callChartData);
            model.addAttribute("scoreChartData", scoreChartData);
            model.addAttribute("problemChartData", problemChartData);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    /*
    @RequestMapping(value="/common/selectScoreChartData.do")
    public String selectScoreChartData(@RequestParam Map<String, Object> params, Model model) {
        try {
            // 서비스 호출
            Object result = commonService.selectScoreChartData(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }
    */

}
