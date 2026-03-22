/**
 * ProfilePage.tsx — User Profile Page
 *
 * Displays user profile information with inline editable fields.
 * Includes "My Contributions" tab for contributors to manage their resources.
 */

import React, { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/context/AuthContext';
import { useUser } from '../../features/users/context/UserContext';
import { 
    fetchMyResources, 
    deleteOwnResource, 
    updateOwnResource, 
    downloadResource 
} from '../../features/resources/api/resourceService';

import EditableField from '../../components/common/EditableField';
import ReadOnlyField from '../../components/common/ReadOnlyField';
import ProfileSection from '../../components/common/ProfileSection';
import ResourceCard from '../../features/resources/components/ResourceCard';
import ResourceDetailDialog from '../../features/resources/components/ResourceDetailDialog';
import EditResourceDialog from '../../features/resources/components/EditResourceDialog';

import { validateName } from '../../utils/validators';
import type { Resource, ApprovalStatus, UpdateResourcePayload } from '../../features/resources/types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const { user, updateUser, isLoading: userLoading, error: userError, retryFetch } = useUser();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [tabValue, setTabValue] = useState(0);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Resources State
    const [myResources, setMyResources] = useState<Resource[]>([]);
    const [resourcesLoading, setResourcesLoading] = useState(false);
    const [resourcesError, setResourcesError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'All'>('All');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 6;

    // Selection/Dialogs
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [editResource, setEditResource] = useState<Resource | null>(null);

    const isContributor = user?.role === 'Contributor' || user?.role === 'Admin';

    const loadMyResources = useCallback(async () => {
        if (!isContributor) return;
        setResourcesLoading(true);
        setResourcesError(null);
        try {
            const res = await fetchMyResources({
                status: statusFilter === 'All' ? undefined : statusFilter,
                page,
                limit: LIMIT,
                sort: 'newest'
            });
            setMyResources(res.data);
            setTotal(res.total);
        } catch (err) {
            setResourcesError('Failed to load your resources.');
        } finally {
            setResourcesLoading(false);
        }
    }, [isContributor, statusFilter, page]);

    useEffect(() => {
        if (tabValue === 1) {
            loadMyResources();
        }
    }, [tabValue, loadMyResources]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleFieldUpdate = useCallback(
        async (field: 'name' | 'academicInfo' | 'expertise', value: string) => {
            setUpdateError(null);
            setUpdateSuccess(false);
            try {
                await updateUser({ [field]: value });
                setUpdateSuccess(true);
                setTimeout(() => setUpdateSuccess(false), 3000);
            } catch (err) {
                setUpdateError(err instanceof Error ? err.message : 'Failed to update profile');
            }
        },
        [updateUser]
    );

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;
        try {
            await deleteOwnResource(id);
            loadMyResources();
        } catch (err) {
            alert('Failed to delete resource.');
        }
    };

    const handleUpdateSubmit = async (id: string, payload: UpdateResourcePayload) => {
        try {
            await updateOwnResource(id, payload);
            loadMyResources();
        } catch (err) {
            throw err;
        }
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (userLoading && !user) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
    if (userError && !user) return <Alert severity="error" sx={{ m: 2 }}>{userError}</Alert>;
    if (!user) return null;

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Profile</Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                    <Tab label="Account Settings" />
                    {isContributor && <Tab label="My Contributions" />}
                </Tabs>
            </Box>

            {/* TAB 0: ACCOUNT SETTINGS */}
            <CustomTabPanel value={tabValue} index={0}>
                {updateSuccess && <Alert severity="success" sx={{ mb: 2 }}>Profile updated!</Alert>}
                {updateError && <Alert severity="error" sx={{ mb: 2 }}>{updateError}</Alert>}

                <ProfileSection title="Account Information" description="Your core account details">
                    <ReadOnlyField label="Email Address" value={user.email} />
                    <ReadOnlyField label="Role" value={user.role} variant="chip" color="primary" />
                    <ReadOnlyField label="Account Status" value={user.accountStatus} variant="chip" color={user.accountStatus === 'Active' ? 'success' : 'warning'} />
                    <ReadOnlyField label="Contribution Score" value={user.contributionScore ?? 0} variant="chip" color="secondary" />
                </ProfileSection>

                <ProfileSection title="Personal Information" description="Details that help other students know you">
                    <EditableField label="Full Name" value={user.name} onSave={(v) => handleFieldUpdate('name', v)} validator={validateName} />
                    <EditableField label="Academic Information" value={user.academicInfo} onSave={(v) => handleFieldUpdate('academicInfo', v)} multiline rows={3} />
                    <EditableField label="Expertise" value={user.expertise} onSave={(v) => handleFieldUpdate('expertise', v)} multiline rows={3} />
                </ProfileSection>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>Log Out</Button>
                </Box>
            </CustomTabPanel>

            {/* TAB 1: MY CONTRIBUTIONS */}
            {isContributor && (
                <CustomTabPanel value={tabValue} index={1}>
                    <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                            <Chip
                                key={status}
                                label={status}
                                onClick={() => { setStatusFilter(status as any); setPage(1); }}
                                color={statusFilter === status ? 'primary' : 'default'}
                                variant={statusFilter === status ? 'filled' : 'outlined'}
                            />
                        ))}
                    </Stack>

                    {resourcesLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                    ) : resourcesError ? (
                        <Alert severity="error">{resourcesError}</Alert>
                    ) : myResources.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'action.hover', borderRadius: 2 }}>
                            <Typography color="text.secondary">No resources found for this status.</Typography>
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                                {myResources.map((res) => (
                                    <ResourceCard
                                        key={res._id}
                                        resource={res}
                                        onSelect={setSelectedResource}
                                        onDownload={downloadResource}
                                        onEdit={(r) => setEditResource(r)}
                                        onDelete={(id) => handleDelete(id)}
                                    />
                                ))}
                            </Box>
                            {total > LIMIT && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                    <Pagination count={Math.ceil(total / LIMIT)} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                                </Box>
                            )}
                        </>
                    )}
                </CustomTabPanel>
            )}

            {/* DIALOGS */}
            <ResourceDetailDialog
                resource={selectedResource}
                open={!!selectedResource}
                onClose={() => setSelectedResource(null)}
                onDownload={downloadResource}
            />

            <EditResourceDialog
                resource={editResource}
                open={!!editResource}
                onClose={() => setEditResource(null)}
                onSubmit={handleUpdateSubmit}
            />
        </Box>
    );
};

export default ProfilePage;
