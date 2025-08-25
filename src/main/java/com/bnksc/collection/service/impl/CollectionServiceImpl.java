package com.bnksc.collection.service.impl;

import com.bnksc.collection.service.CollectionService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(value="collectionService")
public class CollectionServiceImpl  implements CollectionService {

    private final SqlSessionTemplate sqlSession;

    @Autowired
    public CollectionServiceImpl(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }


    @Override
    public Map<String, Object> selectMstrCallOne(Map<String, Object> params) {
        return sqlSession.selectOne("Collection.selectMstrCallOne", params);
    }

    @Override
    public Map<String, Object> selectMstrNonpayList(Map<String, Object> params) {
        // 페이징 처리
        int pageSize = Integer.parseInt(String.valueOf(params.getOrDefault("pageSize", "10")));
        int currentPage = Integer.parseInt(String.valueOf(params.getOrDefault("currentPage", "1")));
        int startRow = (currentPage - 1) * pageSize + 1;
        int endRow = currentPage * pageSize;
        String[] taskId = (String[])params.get("taskId");

        params.put("startRow", startRow);
        params.put("endRow", endRow);

        // 데이터 조회
        List<Map<String, Object>> list = sqlSession.selectList("Collection.selectMstrNonpayList", params);
        int totalCount = sqlSession.selectOne("Collection.selectMstrNonpayListCount", params);
        int customerCount = sqlSession.selectOne("Collection.selectMstrCustomerListCount", params);


        // 결과 맵 구성
        Map<String, Object> result = new HashMap<>();
        result.put("list", list);
        result.put("totalCount", totalCount);
        result.put("currentPage", currentPage);
        result.put("pageSize", pageSize);
        result.put("totalPages", (int) Math.ceil((double) totalCount / pageSize));
        result.put("customerCount", customerCount);
        if(taskId[0].equals("TA0003")) {
            int extCustomerCount = sqlSession.selectOne("Collection.selectMstrExtCustomerListCount", params);
            result.put("extCustomerCount", extCustomerCount);
        }

        return result;
    }

    @Override
    public List<Map<String, Object>> selectProductList(Map<String, Object> params) {
        return sqlSession.selectList("Collection.selectProductList", params);
    }
}
