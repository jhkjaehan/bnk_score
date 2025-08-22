package com.bnksc.auto.web;

import com.bnksc.auto.service.AutoService;
import com.bnksc.common.web.BaseController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class AutoController extends BaseController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="autoService")
    private AutoService autoService;

    /**
     * 리텐션 화면으로 이동
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/auto/retentionPage.do")
    public String retentionPage(HttpServletRequest request, Model model) {
        return "/auto/retention";
    }

    /**
     * 리텐션 상세화면으로 이동
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/auto/retentionDetailPage.do")
    public String retentionDetailPage(HttpServletRequest request, Model model) {
        Map<String, Object> params = getParams(request);
        return "/auto/retentionDetail";
    }

    @RequestMapping(value="/auto/selectCallChartData.do")
    public String selectCallChartData(@RequestParam Map<String, Object> params, Model model) {
        try {

            // 서비스 호출
            Object result = autoService.selectCallChartData(params);
            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    /*
    @RequestMapping(value="/auto/preHappyCallPage.do")
    public String preHappyCallPage(HttpServletRequest request, Model model) {
        return "/auto/preHappyCall";
    }
    */
}