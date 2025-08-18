package com.bnksc.collection.service;

import java.util.List;
import java.util.Map;

public interface CollectionService {
    Map<String, Object> selectMstrCallOne(Map<String, Object> params);

    Map<String, Object> selectMstrNonpayList(Map<String, Object> params);

    List<Map<String, Object>> selectProductList(Map<String, Object> params);
}
