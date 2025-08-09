package com.bnksc.common.web;

import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Controller
public class BaseController {

    protected Map<String, Object> getParams(HttpServletRequest request) {
        Map<String, Object> params = new HashMap<>();

        request.getParameterMap().forEach((key, values) -> {
            if (values.length > 1) {
                params.put(key, values); // 배열 그대로 저장
            } else {
                params.put(key, values[0]); // 단일 값 저장
            }
        });


        request.setAttribute("params", params);
        return params;
    }

}
