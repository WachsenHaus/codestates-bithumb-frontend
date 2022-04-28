import _ from 'lodash';
import { useRef, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { atomFilterKeyword } from '../atom/total.atom';

/**
 *
 * @returns 필터링 검색어와 chnage이벤트를 반환합니다.디바운스 타임은 기본 300ms로 설정되어있습니다.
 */
const useFilterKeyword = (debounceTime = 300) => {
  const [filterKeyword, setFilterKeyword] = useRecoilState(atomFilterKeyword);

  const delayKeyword = useRef(
    _.debounce((word) => debounceKeyword(word), debounceTime)
  ).current;

  const debounceKeyword = (word: any) => {
    setFilterKeyword(word);
  };

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const keyword = e.target.value as string;
      delayKeyword(keyword);
    },
    []
  );

  return [filterKeyword, onChange] as const;
};

export default useFilterKeyword;
