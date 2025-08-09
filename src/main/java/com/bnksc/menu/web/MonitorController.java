package com.bnksc.menu.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MonitorController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value="/monitor/batchLogMonitorPage.do")
    public String batchLogMonitorPage() {
        return "/monitor/batchLogMonitor";
    }
}
