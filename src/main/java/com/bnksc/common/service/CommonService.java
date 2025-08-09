package com.bnksc.common.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface CommonService {

    List<Map<String, Object>> selectCounselorList(Map<String, Object> params);

    List<Map<String, Object>> selectMstrScore(Map<String, Object> params);

    List<Map<String, Object>> selectMstrContentList(Map<String, Object> params);

    Map<String, Object> readConversation(Map<String, Object> params) throws IOException;

    List<Map<String, Object>> selectCallChartData(Map<String, Object> params);

    List<Map<String, Object>> selectScoreChartData(Map<String, Object> params);

    List<Map<String, Object>> selectProblemChartData(Map<String, Object> params);
}
