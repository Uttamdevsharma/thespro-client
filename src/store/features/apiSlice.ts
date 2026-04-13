import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './userSlice';

// RTK Query API Slice for all API interactions
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const userInfoString = localStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        if (userInfo && userInfo.token) {
          headers.set('Authorization', `Bearer ${userInfo.token}`);
        }
      }
    }
    return headers;
  },
});

const baseQueryWithAuth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // If it's a 401 Unauthorized, log out the user
    api.dispatch(logout());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo'); // Ensure token is cleared from localStorage
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Students', 'Teachers', 'Cells', 'Notices', 'Proposals', 'DefenseBoards', 'Rooms', 'ScheduleSlots', 'Evaluations', 'User', 'Departments', 'Committee'],
  endpoints: (builder) => ({
    // Auth
    loginUser: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Admin APIs
    getAdminStats: builder.query<any, void>({
      query: () => '/admin/stats',
      providesTags: ['Students', 'Teachers', 'Departments', 'Committee'],
    }),
    getAdminDepartments: builder.query<any, void>({
      query: () => '/admin/departments',
      providesTags: ['Departments'],
    }),
    getPublicDepartments: builder.query<any, void>({
      query: () => '/public/departments',
      providesTags: ['Departments'],
    }),
    getPublicResearchCells: builder.query<any, void>({
      query: () => '/public/research-cells',
      providesTags: ['Cells'],
    }),
    getPublicFacultyByDepartment: builder.query<any, string>({
      query: (deptId) => `/public/faculty/${deptId}`,
      providesTags: ['Teachers'],
    }),
    getPublicFacultyProfile: builder.query<any, string>({
      query: (id) => `/public/faculty/profile/${id}`,
      providesTags: ['User'],
    }),
    getPublicNotices: builder.query<any, void>({
      query: () => '/public/notices',
      providesTags: ['Notices'],
    }),
    getPublicStats: builder.query<any, void>({
      query: () => '/public/stats',
      providesTags: ['Students', 'Teachers', 'Departments', 'Proposals'],
    }),
    createDepartment: builder.mutation<any, { name: string }>({
      query: (data) => ({
        url: '/admin/departments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Departments'],
    }),
    updateDepartment: builder.mutation<any, { id: string; name: string }>({
      query: ({ id, ...data }) => ({
        url: `/admin/departments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Departments'],
    }),
    deleteDepartment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Departments'],
    }),
    chatWithAI: builder.mutation<any, { message: string; chatHistory: any[] }>({
      query: (data) => ({
        url: '/ai/chat',
        method: 'POST',
        body: data,
      }),
    }),
    generateProposalDescription: builder.mutation<any, { title: string }>({
      query: (data) => ({
        url: '/ai/generate-description',
        method: 'POST',
        body: data,
      }),
    }),
    getAdminTeachers: builder.query<any, string | void>({
      query: (deptId) => `/admin/teachers${deptId ? `?departmentId=${deptId}` : ''}`,
      providesTags: ['Teachers'],
    }),
    createAdminTeacher: builder.mutation<any, any>({
      query: (data) => ({
        url: '/admin/teachers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
    updateAdminTeacher: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/admin/teachers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
    deleteAdminTeacher: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/teachers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teachers'],
    }),
    getAdminStudents: builder.query<any, string | void>({
      query: (deptId) => `/admin/students${deptId ? `?departmentId=${deptId}` : ''}`,
      providesTags: ['Students'],
    }),
    getAdminCommittee: builder.query<any, string | void>({
      query: (deptId) => `/admin/committee${deptId ? `?departmentId=${deptId}` : ''}`,
      providesTags: ['Committee'],
    }),
    assignAdminCommittee: builder.mutation<any, { userId: string; departmentId: string }>({
      query: (data) => ({
        url: '/admin/committee',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Committee'],
    }),
    removeAdminCommittee: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/committee/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Committee'],
    }),

    getStudents: builder.query<any, void>({
      query: () => '/users/students',
      providesTags: ['Students'],
    }),
    updateStudent: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/users/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Students'],
    }),
    getTeachers: builder.query<any, void>({
      query: () => '/users/supervisors',
      providesTags: ['Teachers'],
    }),
    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User' as const, id }],
    }),
    addTeacher: builder.mutation<any, any>({
      query: (teacher) => ({
        url: '/users/add-supervisor',
        method: 'POST',
        body: teacher,
      }),
      invalidatesTags: ['Teachers'],
    }),
    assignCell: builder.mutation<any, { id: string; cellIds: string[] }>({
      query: ({ id, cellIds }) => ({
        url: `/users/${id}/assign-cell`,
        method: 'PUT',
        body: { cellIds },
      }),
      invalidatesTags: ['Teachers', 'User'],
    }),
    removeCell: builder.mutation<any, { id: string; cellId: string }>({
      query: ({ id, cellId }) => ({
        url: `/users/${id}/remove-cell`,
        method: 'PUT',
        body: { cellId },
      }),
      invalidatesTags: ['Teachers', 'User'],
    }),
    getSupervisorsCapacity: builder.query<any, string>({
      query: (researchCellId) => `/users/supervisors/capacity?researchCellId=${researchCellId}`,
      providesTags: ['Teachers'],
    }),
    getAllSupervisors: builder.query<any, void>({
      query: () => '/users/supervisors/all',
      providesTags: ['Teachers'],
    }),
    getCommitteeMembers: builder.query<any, void>({
      query: () => '/users/committee-members',
    }),
    assignCourseSupervisor: builder.mutation<any, { id: string; isCourseSupervisor: boolean; mainSupervisor: string | null }>({
      query: ({ id, ...data }) => ({
        url: `/users/supervisors/${id}/assign-course-supervisor`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Teachers'],
    }),
    getProfile: builder.query<any, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<any, any>({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    updateProfilePicture: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/users/profile-picture',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    getResearchCells: builder.query<any, void>({
      query: () => '/researchcells',
      providesTags: ['Cells'],
    }),
    addResearchCell: builder.mutation<any, any>({
      query: (cell) => ({
        url: '/researchcells',
        method: 'POST',
        body: cell,
      }),
      invalidatesTags: ['Cells'],
    }),
    createProposal: builder.mutation<any, any>({
      query: (newProposal) => ({
        url: '/proposals',
        method: 'POST',
        body: newProposal,
      }),
      invalidatesTags: ['Proposals'],
    }),
    getProposalById: builder.query<any, string>({
      query: (id) => `/proposals/${id}`,
      providesTags: (result, error, id) => [{ type: 'Proposals' as const, id }],
    }),
    getProposalsBySupervisor: builder.query<any, { supervisorId: string; filter?: string }>({
      query: ({ supervisorId, filter }) => {
        let url = `/proposals/supervisor-proposals`;
        if (filter) {
          url += `?filter=${filter}`;
        }
        return url;
      },
      providesTags: ['Proposals'],
    }),
    getSupervisorPendingProposals: builder.query<any, void>({
      query: () => '/proposals/supervisor-pending-proposals',
      providesTags: ['Proposals'],
    }),
    updateProposalStatus: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/proposals/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Proposals'],
    }),
    getStudentProposals: builder.query<any, void>({
      query: () => '/proposals/student-proposals',
      providesTags: ['Proposals'],
    }),
    forwardProposal: builder.mutation<any, string>({
      query: (proposalId) => ({
        url: `/proposals/${proposalId}/forward`,
        method: 'PUT',
      }),
      invalidatesTags: ['Proposals'],
    }),
    getPendingProposalsByCell: builder.query<any, void>({
      query: () => '/proposals/pending-by-cell',
      providesTags: ['Proposals'],
    }),
    rejectProposal: builder.mutation<any, { id: string; feedback: string }>({
      query: ({ id, feedback }) => ({
        url: `/api/proposals/${id}/reject`,
        method: 'PUT',
        body: { feedback },
      }),
      invalidatesTags: ['Proposals'],
    }),
    createDefenseBoard: builder.mutation<any, any>({
      query: (newDefenseBoard) => ({
        url: '/defenseboards',
        method: 'POST',
        body: newDefenseBoard,
      }),
      invalidatesTags: ['DefenseBoards'],
    }),
    setDefenseBoardActive: builder.mutation<any, string>({
      query: (boardId) => ({
        url: `/defenseboards/${boardId}/active`,
        method: 'PATCH',
      }),
      invalidatesTags: ['DefenseBoards'],
    }),
    deleteDefenseBoard: builder.mutation<any, string>({
      query: (id) => ({
        url: `/defenseboards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DefenseBoards'],
    }),
    getAllDefenseBoards: builder.query<any, void>({
      query: () => '/defenseboards',
      providesTags: ['DefenseBoards'],
    }),
    updateDefenseBoard: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/defenseboards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['DefenseBoards'],
    }),
    getDefenseBoardById: builder.query<any, string>({
      query: (id) => `/defenseboards/${id}`,
      providesTags: (result, error, id) => [{ type: 'DefenseBoards' as const, id }],
    }),
    addOrUpdateComment: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/defenseboards/${id}/comments`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['DefenseBoards'],
    }),
    createCommitteeNotice: builder.mutation<any, any>({
      query: (noticeData) => ({
        url: '/notices/committee',
        method: 'POST',
        body: noticeData,
      }),
      invalidatesTags: ['Notices'],
    }),
    getCommitteeSentNotices: builder.query<any, void>({
      query: () => '/notices/committee/sent',
      providesTags: ['Notices'],
    }),
    sendNoticeToGroup: builder.mutation<any, any>({
      query: (noticeData) => ({
        url: '/notices/supervisor',
        method: 'POST',
        body: noticeData,
      }),
      invalidatesTags: ['Notices'],
    }),
    getSupervisorSentNotices: builder.query<any, void>({
      query: () => '/notices/supervisor/sent',
      providesTags: ['Notices'],
    }),
    getNotices: builder.query<any, string>({
      query: (userId) => `/notices?userId=${userId}`,
      providesTags: ['Notices'],
    }),
    getNoticeById: builder.query<any, string>({
      query: (id) => `/notices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notices' as const, id }],
    }),
    createNotice: builder.mutation<any, any>({
      query: (newNotice) => ({
        url: '/notices',
        method: 'POST',
        body: newNotice,
      }),
      invalidatesTags: ['Notices'],
    }),
    updateNotice: builder.mutation<any, { id: string; updatedNotice: any }>({
      query: ({ id, updatedNotice }) => ({
        url: `/notices/${id}`,
        method: 'PUT',
        body: updatedNotice,
      }),
      invalidatesTags: ['Notices'],
    }),
    markNoticeAsRead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notices/mark-as-read/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notices'],
    }),
    deleteNotice: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notices'],
    }),
    getSupervisorDefenseSchedule: builder.query<any, string | undefined>({
      query: (defenseType) => {
        let url = '/defenseboards/supervisor-schedule';
        if (defenseType) {
          url += `?defenseType=${defenseType}`;
        }
        return url;
      },
      providesTags: ['DefenseBoards'],
    }),
    getSupervisorDefenseResults: builder.query<any, string | undefined>({
      query: (defenseType) => {
        let url = '/defenseboards/supervisor-results';
        if (defenseType) {
          url += `?defenseType=${defenseType}`;
        }
        return url;
      },
      providesTags: ['DefenseBoards'],
    }),
    getStudentDefenseSchedule: builder.query<any, string | undefined>({
      query: (defenseType) => {
        let url = '/defenseboards/student-schedule';
        if (defenseType) {
          url += `?defenseType=${defenseType}`;
        }
        return url;
      },
      providesTags: ['DefenseBoards'],
    }),
    getRooms: builder.query<any, void>({
      query: () => '/rooms',
      providesTags: ['Rooms'],
    }),
    addRoom: builder.mutation<any, any>({
      query: (room) => ({
        url: '/rooms',
        method: 'POST',
        body: room,
      }),
      invalidatesTags: ['Rooms'],
    }),
    updateRoom: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/rooms/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Rooms'],
    }),
    deleteRoom: builder.mutation<any, string>({
      query: (id) => ({
        url: `/rooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Rooms'],
    }),
    getScheduleSlots: builder.query<any, void>({
      query: () => '/schedule-slots',
      providesTags: ['ScheduleSlots'],
    }),
    addScheduleSlot: builder.mutation<any, any>({
      query: (slot) => ({
        url: '/schedule-slots',
        method: 'POST',
        body: slot,
      }),
      invalidatesTags: ['ScheduleSlots'],
    }),
    updateScheduleSlot: builder.mutation<any, { id: string; [key: string]: any }>({
      query: ({ id, ...data }) => ({
        url: `/schedule-slots/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['ScheduleSlots'],
    }),
    deleteScheduleSlot: builder.mutation<any, string>({
      query: (id) => ({
        url: `/schedule-slots/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ScheduleSlots'],
    }),
    getProposals: builder.query<any, void>({
      query: () => '/proposals',
      providesTags: ['Proposals'],
    }),
    getApprovedProposals: builder.query<any, void>({
      query: () => '/proposals/approved-proposals',
      providesTags: ['Proposals'],
    }),
    getSupervisorAllGroups: builder.query<any, void>({
      query: () => '/proposals/supervisor-all-groups',
      providesTags: ['Proposals'],
    }),
    getSupervisorDefenseResults: builder.query<any, { filter: string, defenseType: string }>({
      query: (params) => ({
        url: '/defense-results/supervisor',
        params,
      }),
      providesTags: ['Evaluations'],
    }),
    getAvailableProposals: builder.query<any, string | undefined>({
      query: (defenseType) => {
        let url = '/proposals/available-proposals';
        if (defenseType) {
          url += `?defenseType=${defenseType}`;
        }
        return url;
      },
      providesTags: ['Proposals'],
    }),
    getMyResults: builder.query<any, void>({
      query: () => '/evaluations/my-results',
      providesTags: ['Evaluations'],
    }),
    getEvaluationsByProposal: builder.query<any, { proposalId: string; defenseType?: string }>({
      query: ({ proposalId, defenseType }) => {
        let url = `/evaluations/proposal/${proposalId}`;
        if (defenseType) {
          url += `?defenseType=${defenseType}`;
        }
        return url;
      },
      providesTags: ['Evaluations'],
    }),
    submitOrUpdateEvaluation: builder.mutation<any, any>({
      query: (evaluationData) => ({
        url: '/evaluations',
        method: 'POST',
        body: evaluationData,
      }),
      invalidatesTags: ['Evaluations'],
    }),
    getMySupervisions: builder.query<any, void>({
      query: () => '/proposals/my-supervisions',
      providesTags: ['Proposals'],
    }),
    getMyCommitteeEvaluations: builder.query<any, string>({
      query: (defenseType) => `/defenseboards/my-committee-evaluations?defenseType=${defenseType}`,
      providesTags: ['DefenseBoards'],
    }),
    getBoardResults: builder.query<any, string>({
      query: (defenseType) => `/evaluations/board-results?defenseType=${defenseType}`,
      providesTags: ['Evaluations', 'DefenseBoards', 'Proposals'],
    }),
    getPublishStatus: builder.query<any, void>({
      query: () => '/evaluations/publish-status',
      providesTags: ['Evaluations', 'Proposals'],
    }),
    publishAllResults: builder.mutation<any, void>({
      query: () => ({
        url: '/evaluations/publish-all-results',
        method: 'POST',
      }),
      invalidatesTags: ['Proposals', 'Evaluations'],
    }),
    updatePassword: builder.mutation<any, any>({
      query: (passwordData) => ({
        url: '/users/update-password',
        method: 'PUT',
        body: passwordData,
      }),
    }),
    getSubmissionDates: builder.query<any, void>({
      query: () => '/committee/submission-dates',
    }),
    setSubmissionDates: builder.mutation<any, { startDate: string; endDate: string }>({
      query: (dates) => ({
        url: '/committee/submission-dates',
        method: 'POST',
        body: dates,
      }),
    }),
    updateSupervisorProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/supervisor/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useGetTeachersQuery,
  useGetUserByIdQuery,
  useAddTeacherMutation,
  useAssignCellMutation,
  useRemoveCellMutation,
  useGetSupervisorsCapacityQuery,
  useGetAllSupervisorsQuery,
  useGetCommitteeMembersQuery,
  useAssignCourseSupervisorMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useGetResearchCellsQuery,
  useAddResearchCellMutation,
  useCreateProposalMutation,
  useGetProposalByIdQuery,
  useGetProposalsBySupervisorQuery,
  useGetSupervisorPendingProposalsQuery,
  useUpdateProposalStatusMutation,
  useGetStudentProposalsQuery,
  useForwardProposalMutation,
  useGetPendingProposalsByCellQuery,
  useRejectProposalMutation,
  useCreateDefenseBoardMutation,
  useDeleteDefenseBoardMutation,
  useGetAllDefenseBoardsQuery,
  useUpdateDefenseBoardMutation,
  useGetDefenseBoardByIdQuery,
  useAddOrUpdateCommentMutation,
  useCreateCommitteeNoticeMutation,
  useGetCommitteeSentNoticesQuery,
  useSendNoticeToGroupMutation,
  useGetSupervisorSentNoticesQuery,
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useMarkNoticeAsReadMutation,
  useDeleteNoticeMutation,
  useGetSupervisorDefenseScheduleQuery,
  useGetStudentDefenseScheduleQuery,
  useGetRoomsQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetScheduleSlotsQuery,
  useAddScheduleSlotMutation,
  useUpdateScheduleSlotMutation,
  useDeleteScheduleSlotMutation,
  useGetProposalsQuery,
  useGetApprovedProposalsQuery,
  useGetSupervisorAllGroupsQuery,
  useGetSupervisorDefenseResultsQuery,
  useGetAvailableProposalsQuery,
  useGetMyResultsQuery,
  useGetEvaluationsByProposalQuery,
  useSubmitOrUpdateEvaluationMutation,
  useGetMySupervisionsQuery,
  useGetMyCommitteeEvaluationsQuery,
  useGetBoardResultsQuery,
  useGetPublishStatusQuery,
  usePublishAllResultsMutation,
  useUpdatePasswordMutation,
  useGetSubmissionDatesQuery,
  useSetSubmissionDatesMutation,
  useGetAdminStatsQuery,
  useGetAdminDepartmentsQuery,
  useGetPublicDepartmentsQuery,
  useGetPublicResearchCellsQuery,
  useGetPublicNoticesQuery,
  useGetPublicStatsQuery,
  useGetPublicFacultyByDepartmentQuery,
  useGetPublicFacultyProfileQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetAdminTeachersQuery,
  useCreateAdminTeacherMutation,
  useUpdateAdminTeacherMutation,
  useDeleteAdminTeacherMutation,
  useGetAdminStudentsQuery,
  useGetAdminCommitteeQuery,
  useAssignAdminCommitteeMutation,
  useRemoveAdminCommitteeMutation,
  useUpdateSupervisorProfileMutation,
  useChatWithAIMutation,
  useGenerateProposalDescriptionMutation,
} = apiSlice;
