package com.bnksc.retail.service.impl;

import com.bnksc.retail.service.RetailService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service(value="retailService")
public class RetailServiceImpl implements RetailService {

    private final SqlSessionTemplate sqlSession;

    @Autowired
    public RetailServiceImpl(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }
}
