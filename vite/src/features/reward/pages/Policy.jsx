import { useState, useEffect } from 'react';
import { policyApi } from '../api/policyApi';

const Policy = () => {
  const [policyList, setPolicyList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formData, setFormData] = useState({
    policyName: '',
    rewardType: '',
    rewardAmount: '',
    description: '',
    isActive: 'Y'
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const data = await policyApi.getAllPolicies();
      console.log('API Response:', data);
      setPolicyList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('포상 정책 조회 실패:', error);
      setPolicyList([]);
      alert('포상 정책 조회에 실패했습니다.');
    }
  };

  const handleOpenModal = (policy = null) => {
    if (policy) {
      setEditingPolicy(policy);
      setFormData({
        policyName: policy.policyName,
        rewardType: policy.rewardType,
        rewardAmount: policy.rewardAmount,
        description: policy.description || '',
        isActive: policy.isActive
      });
    } else {
      setEditingPolicy(null);
      setFormData({
        policyName: '',
        rewardType: '',
        rewardAmount: '',
        description: '',
        isActive: 'Y'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPolicy(null);
    setFormData({
      policyName: '',
      rewardType: '',
      rewardAmount: '',
      description: '',
      isActive: 'Y'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.policyName.trim()) {
      alert('정책명을 입력해주세요.');
      return;
    }

    if (!formData.rewardType.trim()) {
      alert('포상 유형을 입력해주세요.');
      return;
    }

    if (!formData.rewardAmount || formData.rewardAmount <= 0) {
      alert('포상 금액은 0보다 커야 합니다.');
      return;
    }

    try {
      if (editingPolicy) {
        await policyApi.updatePolicy(editingPolicy.policyId, formData);
        alert('포상 정책이 수정되었습니다.');
      } else {
        await policyApi.createPolicy(formData);
        alert('포상 정책이 추가되었습니다.');
      }
      handleCloseModal();
      fetchPolicies();
    } catch (error) {
      console.error('포상 정책 저장 실패:', error);
      alert('포상 정책 저장에 실패했습니다.');
    }
  };

  const handleDelete = async (policyId) => {
    if (!window.confirm('이 포상 정책을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await policyApi.deletePolicy(policyId);
      alert('포상 정책이 삭제되었습니다.');
      handleCloseModal();
      fetchPolicies();
    } catch (error) {
      console.error('포상 정책 삭제 실패:', error);
      alert('포상 정책 삭제에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, rewardType) => {
    if (!amount) return '0';
    const unit = rewardType === '휴가' ? '일' : '원';
    return amount.toLocaleString() + unit;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>포상 정책 관리</h1>
        <button style={styles.addButton} onClick={() => handleOpenModal()}>
          + 포상 정책 추가
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>정책명</th>
              <th style={styles.th}>포상 유형</th>
              <th style={styles.th}>지급 값</th>
              <th style={styles.th}>설명</th>
              <th style={styles.th}>활성화 여부</th>
              <th style={styles.th}>생성일시</th>
              <th style={styles.th}>관리</th>
            </tr>
          </thead>
          <tbody>
            {policyList.length === 0 ? (
              <tr>
                <td colSpan="7" style={styles.emptyMessage}>
                  등록된 포상 정책이 없습니다.
                </td>
              </tr>
            ) : (
              policyList.map((policy) => (
                <tr key={policy.policyId} style={styles.tr}>
                  <td style={styles.td}>{policy.policyName}</td>
                  <td style={styles.td}>{policy.rewardType}</td>
                  <td style={styles.td}>{formatAmount(policy.rewardAmount, policy.rewardType)}</td>
                  <td style={styles.td}>{policy.description || '-'}</td>
                  <td style={styles.td}>
                    <span style={policy.isActive === 'Y' ? styles.activeBadge : styles.inactiveBadge}>
                      {policy.isActive === 'Y' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(policy.createdAt)}</td>
                  <td style={styles.td}>
                    <button
                      style={styles.editButton}
                      onClick={() => handleOpenModal(policy)}
                    >
                      수정
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              {editingPolicy ? '포상 정책 수정' : '포상 정책 추가'}
            </h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>정책명 *</label>
                <input
                  type="text"
                  name="policyName"
                  value={formData.policyName}
                  onChange={handleInputChange}
                  style={styles.input}
                  maxLength="100"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>포상 유형 *</label>
                <input
                  type="text"
                  name="rewardType"
                  value={formData.rewardType}
                  onChange={handleInputChange}
                  style={styles.input}
                  maxLength="50"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>포상 금액 *</label>
                <input
                  type="number"
                  name="rewardAmount"
                  value={formData.rewardAmount}
                  onChange={handleInputChange}
                  style={styles.input}
                  min="0"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  maxLength="255"
                  rows="4"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>활성화 여부 *</label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  style={styles.input}
                  required
                >
                  <option value="Y">활성</option>
                  <option value="N">비활성</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                {editingPolicy && (
                  <button
                    type="button"
                    style={styles.deleteButtonInModal}
                    onClick={() => handleDelete(editingPolicy.policyId)}
                  >
                    삭제
                  </button>
                )}
                <div style={styles.rightButtons}>
                  <button type="submit" style={styles.submitButton}>
                    {editingPolicy ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    style={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    취소
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#f5f5f5',
    padding: '12px',
    textAlign: 'left',
    fontWeight: 'bold',
    borderBottom: '2px solid #ddd'
  },
  tr: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '12px',
    textAlign: 'left'
  },
  emptyMessage: {
    padding: '40px',
    textAlign: 'center',
    color: '#999'
  },
  activeBadge: {
    padding: '4px 8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  inactiveBadge: {
    padding: '4px 8px',
    backgroundColor: '#999',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '8px',
    fontSize: '12px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    width: '500px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },
  rightButtons: {
    display: 'flex',
    gap: '10px'
  },
  deleteButtonInModal: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#999',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  }
};

export default Policy;