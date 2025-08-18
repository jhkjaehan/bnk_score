package com.bnksc.auto.web;

import com.bnksc.auto.service.AutoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Controller
public class AutoController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="autoService")
    private AutoService autoService;

    @RequestMapping(value="/auto/retentionPage.do")
    public String retentionPage(HttpServletRequest request, Model model) {
        return "/auto/retention";
    }

    @RequestMapping(value="/auto/retentionDetailPage.do")
    public String retentionDetailPage(HttpServletRequest request, Model model) {
        return "/auto/retentionDetail";
    }

    /*
    @RequestMapping(value="/auto/preHappyCallPage.do")
    public String preHappyCallPage(HttpServletRequest request, Model model) {
        return "/auto/preHappyCall";
    }
    */
}