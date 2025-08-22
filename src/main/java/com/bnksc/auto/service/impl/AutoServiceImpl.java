package com.bnksc.auto.service.impl;

import com.bnksc.auto.service.AutoService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service(value = "autoService")
public class AutoServiceImpl implements AutoService {
    private final SqlSessionTemplate sqlSession;

    @Autowired
    public AutoServiceImpl(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    public List<Map<String, Object>> selectCallChartData(Map<String, Object> params) {
        return sqlSession.selectList("Auto.selectCallChartData", params);
    }
}
