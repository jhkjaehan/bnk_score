package com.bnksc.collection.service;

import java.util.List;
import java.util.Map;

public interface CollectionService {
    List<Map<String, Object>> getCounselorList(Map<String, Object> params);

    Map<String, Object> selectMstrCallOne(Map<String, Object> params);

    Map<String, Object> selectMstrNonpayList(Map<String, Object> params);
}
