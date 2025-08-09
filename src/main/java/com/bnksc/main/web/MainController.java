package com.bnksc.main.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class MainController {
    @RequestMapping(value="/main/mainPage.do")
    public String nonpaymentPage(HttpServletRequest request, Model model) {
        return "/main/main";
    }
}
