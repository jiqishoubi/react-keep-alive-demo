import styles from '@/utils/correct.less'

const useGetRow = (record, index) => {
  let className = ''
  className = index % 2 === 0 ? styles.oddRow : styles.evenRow

  return className
}
export { useGetRow }
