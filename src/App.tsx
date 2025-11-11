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
        ? certificates
            .split(",")
            .map((c) => c.trim())
            .filter((c) => c)
        : [];
      const certScores = certList.map((cert) =>
        calculateCertificateMatchScore(cert, jobRole)
      );
      const avgCertScore =
        certScores.length > 0
          ? Math.round(
              certScores.reduce((sum, cs) => sum + cs.score, 0) /
                certScores.length
            )
          : 0;
      const hasEssential = certScores.some((cs) => cs.isEssential);
      const totalScore = Math.round(
        majorScore.score * 0.4 + avgCertScore * 0.6
      );

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
          totalScore >= 90
            ? "S"
            : totalScore >= 80
            ? "A"
            : totalScore >= 70
            ? "B"
            : totalScore >= 60
            ? "C"
            : "D",
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
      {
        이름: "홍길동",
        생년월일: "1995.03.15",
        지원직무: "HR",
        전공: "경영학",
        자격증: "인적자원관리사, 직업상담사",
      },
      {
        이름: "김철수",
        생년월일: "1994.07.22",
        지원직무: "생산기술",
        전공: "기계공학",
        자격증: "일반기계기사, 품질경영기사",
      },
      {
        이름: "이영희",
        생년월일: "1996.11.08",
        지원직무: "설계",
        전공: "자동차공학",
        자격증: "기계설계기사, 자동차정비기사",
      },
      {
        이름: "박민수",
        생년월일: "1993.05.30",
        지원직무: "품질",
        전공: "산업공학",
        자격증: "품질경영기사",
      },
      {
        이름: "정수진",
        생년월일: "1997.01.12",
        지원직무: "안전관리",
        전공: "안전공학",
        자격증: "산업안전기사, 건설안전기사",
      },
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
    XLSX.writeFile(
      wb,
      `일괄평가결과_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  useEffect(() => {
    if (uploadedData.length > 0) evaluateBatchData();
  }, [uploadedData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-t-4 border-blue-600">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                직무 역량 매칭 평가 시스템
              </h1>
              <p className="text-gray-600">
                엑셀 파일 업로드로 대량 평가를 수행하거나 개별 검색이 가능합니다
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setViewMode("manual")}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  viewMode === "manual"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Search className="inline mr-2" size={20} />
                개별 검색
              </button>
              <button
                onClick={() => setViewMode("batch")}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  viewMode === "batch"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FileSpreadsheet className="inline mr-2" size={20} />
                일괄 평가
              </button>
            </div>
          </div>
        </div>

        {viewMode === "batch" ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    일괄 평가 모드
                  </h2>
                  <p className="text-gray-600">
                    엑셀 파일로 여러 지원자를 한 번에 평가합니다
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg"
                >
                  <Download size={20} />
                  템플릿 다운로드
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <h3 className="font-bold text-lg mb-2">엑셀 파일 업로드</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    이름, 생년월일, 지원직무, 전공, 자격증 정보가 포함된 파일
                  </p>
                  <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-all">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    파일 선택
                  </label>
                  {uploadedData.length > 0 && (
                    <p className="mt-4 text-green-600 font-bold">
                      ✓ {uploadedData.length}명의 지원자 데이터 로드됨
                    </p>
                  )}
                </div>

                <div className="border-2 border-gray-300 rounded-xl p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                  <CheckCircle
                    className="mx-auto mb-4 text-green-500"
                    size={48}
                  />
                  <h3 className="font-bold text-lg mb-2">자동 직무별 평가</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    엑셀 파일에 지원직무가 포함되어 있으면
                    <br />
                    자동으로 직무별 평가가 진행됩니다
                  </p>
                  {evaluatedData.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-bold text-blue-600 mb-2">
                        평가 완료된 직무:
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {[...new Set(evaluatedData.map((d) => d.지원직무))].map(
                          (job, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white rounded-full text-xs font-bold text-gray-700 shadow-sm"
                            >
                              {job}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>📋 필수 컬럼:</strong> 이름, 생년월일, 지원직무, 전공,
                  자격증
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  • 지원직무는 정확히 입력해주세요 (예: HR, 생산기술, 설계 등)
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">사용 가능한 직무 목록:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-3 bg-gray-50 rounded-lg text-center"
                    >
                      <div className="text-xs text-gray-500">
                        {job.category}
                      </div>
                      <div className="text-sm font-bold text-gray-700">
                        {job.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {evaluatedData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      평가 결과
                    </h2>
                    <p className="text-gray-600">
                      총 {evaluatedData.length}명 평가 완료 (직무별 자동 분류)
                    </p>
                  </div>
                  <button
                    onClick={downloadResults}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    <Download size={20} />
                    결과 다운로드
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600">
                        <tr className="text-white">
                          <th className="p-3 text-left">순위</th>
                          <th className="p-3 text-left">이름</th>
                          <th className="p-3 text-left">생년월일</th>
                          <th className="p-3 text-left">지원직무</th>
                          <th className="p-3 text-left">전공</th>
                          <th className="p-3 text-center">전공점수</th>
                          <th className="p-3 text-left">자격증</th>
                          <th className="p-3 text-center">자격증점수</th>
                          <th className="p-3 text-center">필수보유</th>
                          <th className="p-3 text-center">종합점수</th>
                          <th className="p-3 text-center">등급</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evaluatedData.map((app, idx) => (
                          <tr
                            key={idx}
                            className={`border-b hover:bg-gray-50 ${
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="p-3 font-bold text-gray-700">
                              {idx + 1}
                            </td>
                            <td className="p-3 font-bold">{app.이름}</td>
                            <td className="p-3 text-sm text-gray-600">
                              {app.생년월일}
                            </td>
                            <td className="p-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                {app.지원직무}
                              </span>
                            </td>
                            <td className="p-3 text-sm">{app.전공}</td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  app.전공점수 >= 90
                                    ? "bg-green-100 text-green-700"
                                    : app.전공점수 >= 70
                                    ? "bg-blue-100 text-blue-700"
                                    : app.전공점수 >= 50
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {app.전공점수}
                              </span>
                            </td>
                            <td className="p-3 text-sm">{app.자격증 || "-"}</td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  app.자격증평균점수 >= 90
                                    ? "bg-green-100 text-green-700"
                                    : app.자격증평균점수 >= 70
                                    ? "bg-blue-100 text-blue-700"
                                    : app.자격증평균점수 >= 50
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {app.자격증평균점수}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  app.필수자격증보유 === "O"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {app.필수자격증보유}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-bold">
                                {app.종합점수}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <span
                                className={`px-4 py-2 rounded-full text-lg font-bold ${
                                  app.평가등급 === "S"
                                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                                    : app.평가등급 === "A"
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                    : app.평가등급 === "B"
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
                                    : app.평가등급 === "C"
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white"
                                    : "bg-gray-400 text-white"
                                }`}
                              >
                                {app.평가등급}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold mb-2">평가 기준</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-sm">
                    <div>
                      • <strong>종합점수</strong>: 전공 40% + 자격증 60%
                    </div>
                    <div>
                      • <strong>S등급</strong>: 90점 이상 (최우수)
                    </div>
                    <div>
                      • <strong>필수 자격증</strong>: 직무별 필수 자격증 보유 여부
                    </div>
                    <div>
                      • <strong>A등급</strong>: 80-89점 (우수)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="text-blue-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">직무 선택</h2>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${
                        selectedJob?.id === job.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="text-xs font-semibold opacity-80 mb-1">
                        {job.category}
                      </div>
                      <div className="font-bold">{job.role}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {!selectedJob ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">👈</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    직무를 선택해주세요
                  </h3>
                  <p className="text-gray-600">
                    좌측에서 평가하고 싶은 직무를 선택하시면
                    <br />
                    해당 직무와 관련된 전공 및 자격증 매칭 결과를 확인할 수 있습니다
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="text-purple-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedJob.role} - 개별 검색 모드
                    </h2>
                  </div>

                  <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl text-center">
                    <BookOpen className="mx-auto mb-4 text-blue-600" size={64} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      직무별 전공/자격증 기준 확인
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {selectedJob.role} 직무에 필요한 전공과 자격증 정보를 확인하세요
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <BookOpen className="text-blue-600" size={20} />
                          핵심 전공
                        </h4>
                        <ul className="space-y-2">
                          {jobMajorRules[selectedJob.role]?.highMatch.map(
                            (major, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={16} />
                                <span className="text-sm">{major}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-md">
                        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                          <Award className="text-purple-600" size={20} />
                          필수/우대 자격증
                        </h4>
                        <div className="space-y-3">
                          {jobCertificateRules[selectedJob.role]?.essential.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-red-600 mb-2">
                                필수 자격증
                              </p>
                              <ul className="space-y-1">
                                {jobCertificateRules[selectedJob.role].essential.map(
                                  (cert, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                      <span className="text-sm">{cert}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-blue-600 mb-2">
                              우대 자격증
                            </p>
                            <ul className="space-y-1">
                              {jobCertificateRules[selectedJob.role]?.highMatch
                                .slice(0, 3)
                                .map((cert, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="text-blue-500" size={14} />
                                    <span className="text-sm">{cert}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Tip:</strong> 상단의 "일괄 평가" 버튼을 클릭하여
                        여러 지원자를 한 번에 평가할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mt-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-white" size={28} />
            <h3 className="text-2xl font-bold">시스템 사용 가이드</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">📥</div>
              <h4 className="font-bold mb-2">템플릿 다운로드</h4>
              <p className="text-sm opacity-90">
                일괄 평가 모드에서 엑셀 템플릿을 다운로드하세요
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-bold mb-2">지원자 정보 입력</h4>
              <p className="text-sm opacity-90">
                이름, 생년월일, 지원직무, 전공, 자격증 정보를 엑셀에 입력합니다
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold mb-2">결과 다운로드</h4>
              <p className="text-sm opacity-90">
                평가 완료 후 결과를 엑셀 파일로 다운로드합니다
              </p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <FileSpreadsheet size={20} />
              엑셀 파일 형식
            </h4>
            <div className="text-sm space-y-1 opacity-90">
              <p>
                • <strong>필수 컬럼:</strong> 이름, 생년월일, 지원직무, 전공, 자격증
              </p>
              <p>
                • <strong>생년월일 형식:</strong> yyyy.mm.dd (예: 1995.03.15)
              </p>
              <p>
                • <strong>지원직무:</strong> HR, 생산기술, 설계 등 정확히 입력
              </p>
              <p>
                • <strong>자격증 입력:</strong> 쉼표(,)로 구분하여 입력 (예:
                일반기계기사, 품질경영기사)
              </p>
              <p>
                • <strong>평가 결과:</strong> 직무별로 자동 분류되어 평가됩니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMajorMatchingSystem;
