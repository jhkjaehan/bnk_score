package com.bnksc.retail.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class RetailController {

    @RequestMapping(value="/retail/excellentLoanPage.do")
    public String excellentLoanPage(HttpServletRequest request, Model model) {
        return "/retail/excellentLoan";
    }

    @RequestMapping(value="/retail/excellentLoanDetailPage.do")
    public String excellentLoanDetailPage(HttpServletRequest request, Model model) {
        return "/retail/excellentLoanDetail";
    }

    /*
    @RequestMapping(value="/retail/loanAgreementPage.do")
    public String loanAgreementPage(HttpServletRequest request, Model model) {
        return "/retail/loanAgreement";
    }

    @RequestMapping(value="/retail/loanAgreementDetailPage.do")
    public String loanAgreementDetailPage(HttpServletRequest request, Model model) {
        return "/retail/loanAgreementDetail";
    }
    */
}