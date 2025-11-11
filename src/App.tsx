import React, { useState, useEffect } from "react";
import { Search, Award, BookOpen, Briefcase, CheckCircle, Users, Upload, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";

const JobMajorMatchingSystem = () => {
  const [jobs] = useState([
    { id: 1, category: "경영지원", role: "HR" },
    { id: 2, category: "경영지원", role: "해외법인관리" },
    { id: 3, category: "경영지원", role: "구매" },
    { id: 4, category: "경영지원", role: "수출입" },
    { id: 5, category: "경영지원", role: "국내·외 마케팅/개발" },
    { id: 6, category: "생산제조", role: "생산기술" },
    { id: 7, category: "생산제조", role: "공정관리" },
    { id: 8, category: "생산제조", role: "생산관리" },
    { id: 9, category: "생산제조", role: "자재관리" },
    { id: 10, category: "품질", role: "품질" },
    { id: 11, category: "연구개발", role: "설계" },
    { id: 12, category: "안전", role: "안전관리" },
  ]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [evaluatedData, setEvaluatedData] = useState([]);
  const [viewMode, setViewMode] = useState("manual");

  const jobMajorRules = {
    HR: {
      highMatch: ["인사조직", "인사관리", "심리학", "산업심리", "경영학", "경영정보"],
      mediumMatch: ["행정학", "사회학", "교육학", "노사관계", "법학"],
      keywords: ["인사", "조직", "심리", "경영", "관리", "교육"],
    },
    해외법인관리: {
      highMatch: ["경영학", "국제경영", "회계학", "경제학", "무역학", "국제통상"],
      mediumMatch: ["경영정보", "재무금융", "국제학", "글로벌경영"],
      keywords: ["경영", "회계", "경제", "무역", "국제", "금융"],
    },
    구매: {
      highMatch: ["기계공학", "전기공학", "산업공학", "경영학", "물류관리"],
      mediumMatch: ["전자공학", "재료공학", "무역학", "SCM"],
      keywords: ["기계", "전기", "산업", "물류", "경영", "전자", "재료"],
    },
    수출입: {
      highMatch: ["무역학", "국제통상", "물류관리", "경영학", "관세학"],
      mediumMatch: ["경제학", "국제학", "행정학", "법학"],
      keywords: ["무역", "통상", "물류", "경영", "경제", "관세"],
    },
    "국내·외 마케팅/개발": {
      highMatch: ["기계공학", "경영학", "마케팅", "산업공학", "자동차공학"],
      mediumMatch: ["전자공학", "국제경영", "경제학", "상경학"],
      keywords: ["기계", "경영", "마케팅", "자동차", "산업"],
    },
    생산기술: {
      highMatch: ["기계공학", "자동차공학", "금속공학", "메카트로닉스", "산업공학"],
      mediumMatch: ["전기공학", "전자공학", "재료공학", "생산공학"],
      keywords: ["기계", "자동차", "금속", "메카트로닉스", "산업", "전기", "생산"],
    },
    공정관리: {
      highMatch: ["기계공학", "자동차공학", "산업공학", "생산공학"],
      mediumMatch: ["전기공학", "화학공학", "안전공학", "경영공학"],
      keywords: ["기계", "자동차", "산업", "생산", "공정", "안전"],
    },
    생산관리: {
      highMatch: ["기계공학", "자동차공학", "산업공학", "생산공학", "경영공학"],
      mediumMatch: ["전기공학", "경영학", "물류관리"],
      keywords: ["기계", "자동차", "산업", "생산", "경영", "관리"],
    },
    자재관리: {
      highMatch: ["기계공학", "자동차공학", "산업공학", "물류관리"],
      mediumMatch: ["경영학", "생산공학", "전기공학"],
      keywords: ["기계", "자동차", "산업", "물류", "경영", "자재"],
    },
    품질: {
      highMatch: ["기계공학", "자동차공학", "산업공학", "품질관리"],
      mediumMatch: ["전기공학", "전자공학", "재료공학", "화학공학"],
      keywords: ["기계", "자동차", "산업", "품질", "전기", "전자"],
    },
    설계: {
      highMatch: ["기계공학", "자동차공학", "기계설계", "메카트로닉스"],
      mediumMatch: ["전기공학", "전자공학", "산업공학", "재료공학"],
      keywords: ["기계", "자동차", "설계", "메카트로닉스", "전기"],
    },
    안전관리: {
      highMatch: ["산업공학", "안전공학", "산업안전", "환경공학"],
      mediumMatch: ["기계공학", "화학공학", "보건학"],
      keywords: ["산업", "안전", "환경", "보건", "기계", "화학"],
    },
  };

  const jobCertificateRules = {
    HR: {
      essential: ["인적자원관리사", "직업상담사"],
      highMatch: ["경영지도사", "노무사"],
      mediumMatch: ["사회조사분석사", "컴퓨터활용능력"],
      keywords: ["인적자원", "인사", "직업상담", "노무", "경영"],
    },
    해외법인관리: {
      essential: ["공인회계사", "세무사"],
      highMatch: ["회계관리", "재경관리사", "국제무역사"],
      mediumMatch: ["경영지도사", "외환관리사"],
      keywords: ["회계", "세무", "재경", "무역", "경영", "외환"],
    },
    구매: {
      essential: [],
      highMatch: ["구매자재관리사", "물류관리사", "유통관리사"],
      mediumMatch: ["일반기계기사", "전기기사"],
      keywords: ["구매", "자재", "물류", "유통", "기계", "전기"],
    },
    수출입: {
      essential: ["국제무역사", "관세사"],
      highMatch: ["물류관리사", "유통관리사"],
      mediumMatch: ["외환관리사", "국제무역영어"],
      keywords: ["무역", "관세", "물류", "유통", "외환"],
    },
    "국내·외 마케팅/개발": {
      essential: [],
      highMatch: ["기계기사", "자동차정비기사", "전자기사"],
      mediumMatch: ["마케팅관리사", "품질경영기사"],
      keywords: ["기계", "자동차", "전자", "마케팅", "품질"],
    },
    생산기술: {
      essential: ["기계기사", "일반기계기사"],
      highMatch: ["자동차정비기사", "금형기사", "메카트로닉스기사"],
      mediumMatch: ["전기기사", "용접기사", "기계설계기사"],
      keywords: ["기계", "자동차", "금형", "메카트로닉스", "전기", "용접", "설계"],
    },
    공정관리: {
      essential: ["일반기계기사", "산업안전기사"],
      highMatch: ["기계기사", "자동차정비기사", "품질경영기사"],
      mediumMatch: ["전기기사", "화공기사"],
      keywords: ["기계", "안전", "자동차", "품질", "전기", "화공"],
    },
    생산관리: {
      essential: ["산업안전기사"],
      highMatch: ["일반기계기사", "품질경영기사", "물류관리사"],
      mediumMatch: ["생산자동화기사", "컴퓨터활용능력"],
      keywords: ["안전", "기계", "품질", "물류", "생산", "자동화"],
    },
    자재관리: {
      essential: [],
      highMatch: ["물류관리사", "유통관리사", "구매자재관리사"],
      mediumMatch: ["일반기계기사", "ERP정보관리사"],
      keywords: ["물류", "유통", "구매", "자재", "ERP"],
    },
    품질: {
      essential: ["품질경영기사"],
      highMatch: ["일반기계기사", "자동차정비기사"],
      mediumMatch: ["전기기사", "전자기사", "화공기사"],
      keywords: ["품질", "기계", "자동차", "전기", "전자", "화공"],
    },
    설계: {
      essential: ["기계설계기사"],
      highMatch: ["일반기계기사", "자동차정비기사", "전산응용기계제도기능사"],
      mediumMatch: ["전기기사", "전자기사", "메카트로닉스기사"],
      keywords: ["설계", "기계", "자동차", "전산", "제도", "전기", "메카트로닉스"],
    },
    안전관리: {
      essential: ["산업안전기사", "산업안전산업기사"],
      highMatch: ["건설안전기사", "화학안전기사", "가스안전기사"],
      mediumMatch: ["위험물기능사", "소방설비기사"],
      keywords: ["안전", "산업안전", "건설안전", "화학안전", "가스", "위험물", "소방"],
    },
  };

  const calculateMajorMatchScore = (major, jobRole) => {
    const rules = jobMajorRules[jobRole];
    if (!rules) return { score: 50, level: "medium", reason: "기본 매칭" };
    const majorName = major.toLowerCase();
    for (const kw of rules.highMatch)
      if (majorName.includes(kw.toLowerCase()))
        return { score: 95, level: "high", reason: `${kw}은(는) 핵심 전공` };
    for (const kw of rules.mediumMatch)
      if (majorName.includes(kw.toLowerCase()))
        return { score: 75, level: "medium", reason: `${kw}은(는) 관련 전공` };
    for (const kw of rules.keywords)
      if (majorName.includes(kw))
        return { score: 60, level: "low", reason: `${kw} 관련 전공` };
    return { score: 40, level: "none", reason: "연관성 낮음" };
  };

  const calculateCertificateMatchScore = (certificate, jobRole) => {
    const rules = jobCertificateRules[jobRole];
    if (!rules)
      return {
        score: 50,
        level: "medium",
        reason: "기본 매칭",
        isEssential: false,
      };
    const certName = certificate.toLowerCase();
    for (const kw of rules.essential)
      if (certName.includes(kw.toLowerCase()))
        return {
          score: 100,
          level: "essential",
          reason: `${kw}은(는) 필수 자격증`,
          isEssential: true,
        };
    for (const kw of rules.highMatch)
      if (certName.includes(kw.toLowerCase()))
        return {
          score: 90,
          level: "high",
          reason: `${kw}은(는) 우대 자격증`,
          isEssential: false,
        };
    for (const kw of rules.mediumMatch)
      if (certName.includes(kw.toLowerCase()))
        return {
          score: 70,
          level: "medium",
          reason: `${kw}은(는) 관련 자격증`,
          isEssential: false,
        };
    for (const kw of rules.keywords)
      if (certName.includes(kw))
        return {
          score: 55,
          level: "low",
          reason: `${kw} 관련 자격증`,
          isEssential: false,
        };
    return {
      score: 35,
      level: "none",
      reason: "연관성 낮음",
      isEssential: false,
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setUploadedData(jsonData);
        setViewMode("batch");
      } catch (error) {
        alert("파일 읽기 오류: " + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const evaluateBatchData = () => {
    if (uploadedData.length === 0) return;

    const evaluated = uploadedData.map((applicant) => {
      const name = applicant["이름"] || applicant["성명"] || "";
      const birthDate = applicant["생년월일"] || "";
      const jobRole = applicant["지원직무"] || applicant["직무"] || "";
      const major = applicant["전공"] || "";
      const certificates = applicant["자격증"] || "";

      if (!jobRole) {
        return {
          이름: name,
          생년월일: birthDate,
          지원직무: "직무 미입력",
          전공: major,
          전공점수: 0,
          전공평가: "지원직무를 입력해주세요",
          자격증: certificates,
          자격증평균점수: 0,
          필수자격증보유: "-",
          종합점수: 0,
          평가등급: "-",
        };
      }

      const majorScore = major
        ? calculateMajorMatchScore(major, jobRole)
        : { score: 0, level: "none", reason: "전공 정보 없음" };
      const certList = certificates
        ? certificates.split(",").map((c) => c.trim()).filter((c) => c)
        : [];
      const certScores = certList.map((cert) =>
        calculateCertificateMatchScore(cert, jobRole)
      );
      const avgCertScore =
        certScores.length > 0
          ? Math.round(
              certScores.reduce((sum, cs) => sum + cs.score, 0) / certScores.length
            )
          : 0;
      const hasEssential = certScores.some((cs) => cs.isEssential);
      const totalScore = Math.round(majorScore.score * 0.4 + avgCertScore * 0.6);

      return {
        이름: name,
        생년월일: birthDate,
        지원직무: jobRole,
        전공: major,
        전공점수: majorScore.score,
        전공평가: majorScore.reason,
        자격증: certificates,
        자격증평균점수: avgCertScore,
        필수자격증보유: hasEssential ? "O" : "X",
        종합점수: totalScore,
        평가등급:
          totalScore >= 90 ? "S" : totalScore >= 80 ? "A" : totalScore >= 70 ? "B" : totalScore >= 60 ? "C" : "D",
      };
    });

    evaluated.sort((a, b) => {
      if (a.지원직무 !== b.지원직무) {
        return a.지원직무.localeCompare(b.지원직무);
      }
      return b.종합점수 - a.종합점수;
    });

    setEvaluatedData(evaluated);
  };

  const downloadTemplate = () => {
    const template = [
      { 이름: "홍길동", 생년월일: "1995.03.15", 지원직무: "HR", 전공: "경영학", 자격증: "인적자원관리사, 직업상담사" },
      { 이름: "김철수", 생년월일: "1994.07.22", 지원직무: "생산기술", 전공: "기계공학", 자격증: "일반기계기사, 품질경영기사" },
      { 이름: "이영희", 생년월일: "1996.11.08", 지원직무: "설계", 전공: "자동차공학", 자격증: "기계설계기사, 자동차정비기사" },
      { 이름: "박민수", 생년월일: "1993.05.30", 지원직무: "품질", 전공: "산업공학", 자격증: "품질경영기사" },
      { 이름: "정수진", 생년월일: "1997.01.12", 지원직무: "안전관리", 전공: "안전공학", 자격증: "산업안전기사, 건설안전기사" },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "지원자명단");
    XLSX.writeFile(wb, "지원자_업로드_템플릿.xlsx");
  };

  const downloadResults = () => {
    if (evaluatedData.length === 0) {
      alert("평가 결과가 없습니다.");
      return;
    }
    const ws = XLSX.utils.json_to_sheet(evaluatedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "평가결과");
    XLSX.writeFile(wb, `일괄평가결과_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  useEffect(() => {
    if (uploadedData.length > 0) evaluateBatchData();
  }, [uploadedData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-t-4 border-blue-600">
          <h1 className="text-4xl font-bold">직무 역량 매칭 평가 시스템</h1>
          <p className="text-gray-600 mt-2">엑셀 파일 업로드로 대량 평가를 수행하거나 개별 검색이 가능합니다</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setViewMode("manual")} className={`px-6 py-3 rounded-xl font-bold ${viewMode === "manual" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
              개별 검색
            </button>
            <button onClick={() => setViewMode("batch")} className={`px-6 py-3 rounded-xl font-bold ${viewMode === "batch" ? "bg-purple-600 text-white" : "bg-gray-100"}`}>
              일괄 평가
            </button>
          </div>
        </div>
        
        {viewMode === "batch" ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">일괄 평가 모드</h2>
            <button onClick={downloadTemplate} className="px-6 py-3 bg-green-500 text-white rounded-xl mb-4">
              템플릿 다운로드
            </button>
            <label className="block px-6 py-3 bg-blue-600 text-white rounded-xl cursor-pointer inline-block">
              <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
              파일 선택
            </label>
            {uploadedData.length > 0 && <p className="mt-4 text-green-600">✓ {uploadedData.length}명 로드됨</p>}
            {evaluatedData.length > 0 && (
              <div className="mt-6">
                <button onClick={downloadResults} className="px-6 py-3 bg-green-600 text-white rounded-xl mb-4">
                  결과 다운로드
                </button>
                <div className="overflow-x-auto">
                  <table className="w-full border">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-3">순위</th>
                        <th className="p-3">이름</th>
                        <th className="p-3">생년월일</th>
                        <th className="p-3">지원직무</th>
                        <th className="p-3">전공</th>
                        <th className="p-3">전공점수</th>
                        <th className="p-3">자격증</th>
                        <th className="p-3">자격증점수</th>
                        <th className="p-3">필수보유</th>
                        <th className="p-3">종합점수</th>
                        <th className="p-3">등급</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluatedData.map((app, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-3 text-center">{idx + 1}</td>
                          <td className="p-3">{app.이름}</td>
                          <td className="p-3">{app.생년월일}</td>
                          <td className="p-3">{app.지원직무}</td>
                          <td className="p-3">{app.전공}</td>
                          <td className="p-3 text-center">{app.전공점수}</td>
                          <td className="p-3">{app.자격증}</td>
                          <td className="p-3 text-center">{app.자격증평균점수}</td>
                          <td className="p-3 text-center">{app.필수자격증보유}</td>
                          <td className="p-3 text-center font-bold">{app.종합점수}</td>
                          <td className="p-3 text-center font-bold">{app.평가등급}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">개별 검색 모드</h2>
            <div className="grid grid-cols-3 gap-4">
              {jobs.map((job) => (
                <button key={job.id} onClick={() => setSelectedJob(job)} className={`p-4 rounded-xl ${selectedJob?.id === job.id ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                  <div className="text-xs">{job.category}</div>
                  <div className="font-bold">{job.role}</div>
                </button>
              ))}
            </div>
            {selectedJob && (
              <div className="mt-6 p-6 bg-blue-50 rounded-xl">
                <h3 className="text-xl font-bold mb-4">{selectedJob.role} - 직무 정보</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold mb-2">핵심 전공</h4>
                    <ul className="space-y-1">
                      {jobMajorRules[selectedJob.role]?.highMatch.map((major, idx) => (
                        <li key={idx}>• {major}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">필수/우대 자격증</h4>
                    <ul className="space-y-1">
                      {jobCertificateRules[selectedJob.role]?.essential.map((cert, idx) => (
                        <li key={idx} className="text-red-600">★ {cert} (필수)</li>
                      ))}
                      {jobCertificateRules[selectedJob.role]?.highMatch.slice(0,3).map((cert, idx) => (
                        <li key={idx}>• {cert}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMajorMatchingSystem;
