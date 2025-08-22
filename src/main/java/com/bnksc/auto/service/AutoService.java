package com.bnksc.auto.service;

import java.util.List;
import java.util.Map;

public interface AutoService {
    List<Map<String, Object>> selectCallChartData (Map<String, Object> params);
}
