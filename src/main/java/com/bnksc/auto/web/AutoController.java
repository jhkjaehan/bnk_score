package com.bnksc.auto.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class AutoController {

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