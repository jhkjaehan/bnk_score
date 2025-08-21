package com.bnksc.retail.service;

import java.util.List;
import java.util.Map;

public interface RetailService {

    List<Map<String, Object>> selectCallChartData (Map<String, Object> params);
}
