package com.bnksc.menu.service.impl;

import com.bnksc.menu.service.MonitorService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(value="monitorService")
public class MonitorServiceImpl implements MonitorService {
    private final SqlSessionTemplate sqlSession;

    @Autowired
    public MonitorServiceImpl(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    public Map<String, Object> selectBatchLogList(Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        List<Map<String,Object>> list;

        // 페이징 파라미터가 있는 경우에만 페이징 처리
        if (params.containsKey("currentPage") && params.containsKey("pageSize")) {
            // 페이징 처리
            int pageSize = Integer.parseInt(String.valueOf(params.getOrDefault("pageSize", "10")));
            int currentPage = Integer.parseInt(String.valueOf(params.getOrDefault("currentPage", "1")));
            int startRow = (currentPage - 1) * pageSize + 1;
            int endRow = currentPage * pageSize;

            params.put("startRow", startRow);
            params.put("endRow", endRow);

            list = sqlSession.selectList("Monitor.selectBatchLogList", params);
        } else {
            // 페이징 없이 전체 데이터 조회
            params.remove("startRow");
            params.remove("endRow");
            list = sqlSession.selectList("Monitor.selectBatchLogList", params);
        }

        int totalCount = sqlSession.selectOne("Monitor.selectBatchLogCount", params);


        result.put("list", list);
        result.put("totalCount", totalCount);

        return result;
    }
}
