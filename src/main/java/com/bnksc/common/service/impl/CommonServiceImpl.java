package com.bnksc.common.service.impl;

import com.bnksc.common.service.CommonService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(value="commonService")
public class CommonServiceImpl implements CommonService {
    private final SqlSessionTemplate sqlSession;

    @Value("${Globals.ConversationFilePath}")
    private String basePath;


    @Autowired
    public CommonServiceImpl(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }

    @Override
    public List<Map<String, Object>> selectCounselorList(Map<String, Object> params) {
        return sqlSession.selectList("Common.selectCounselorList", params);
    }

    @Override
    public List<Map<String, Object>> selectMstrScore(Map<String, Object> params) {
        return sqlSession.selectList("Common.selectMstrScore", params);
    }

    @Override
    public List<Map<String, Object>> selectMstrContentList(Map<String, Object> params) {
        return sqlSession.selectList("Common.selectMstrContentList", params);
    }

    @Override
    public Map<String, Object> readConversation(Map<String, Object> params) throws IOException {

        String taskId = (String) params.get("taskId");
        Map<String, Object> mstrCall = sqlSession.selectOne("Collection.selectMstrCallOne", params);
        String filePath_str = (String) mstrCall.get("filePath");

        // 파일 경로 생성
        Path filePath = Paths.get(filePath_str);

        // 파일 존재 확인
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("대화 내용 파일을 찾을 수 없습니다.");
        }

        // 파일 읽기
        List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);

        // JSON 형식으로 변환
        List<Map<String, String>> conversations = new ArrayList<>();

        for (String line : lines) {
            if (line.trim().isEmpty()) continue;

            String[] parts = line.split(" : ", 2);
            if (parts.length == 2) {
                Map<String, String> message = new HashMap<>();
                message.put("speaker", parts[0].trim());
                message.put("content", parts[1].trim());
                message.put("type", getSpeakerType(parts[0].trim()));
                conversations.add(message);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("conversations", conversations);
        result.put("totalCount", conversations.size());

        return result;

    }

    @Override
    public List<Map<String, Object>> selectCallChartData(Map<String, Object> params) {
        return sqlSession.selectList("MstrChart.selectCallChartData", params);
    }

    @Override
    public List<Map<String, Object>> selectScoreChartData(Map<String, Object> params) {
        return sqlSession.selectList("MstrChart.selectScoreChartData", params);
    }

    @Override
    public List<Map<String, Object>> selectProblemChartData(Map<String, Object> params) {
        return sqlSession.selectList("MstrChart.selectProblemChartData", params);
    }

    private String getSpeakerType(String speaker) {
        return switch (speaker) {
            case "상담사" -> "counselor";
            case "고객" -> "customer";
            default -> "unknown";
        };
    }


}
