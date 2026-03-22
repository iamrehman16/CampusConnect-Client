/**
 * ProfilePage.tsx — User Profile Page
 *
 * Displays user profile information with inline editable fields.
 * Editable fields: name, academicInfo, expertise
 * Read-only fields: email, role, accountStatus, contributionScore, member since
 */

import React, { useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/context/AuthContext';

import { useUser } from '../../features/users/context/UserContext';
import EditableField from '../../components/common/EditableField';
import ReadOnlyField from '../../components/common/ReadOnlyField';
import ProfileSection from '../../components/common/ProfileSection';
import { validateName } from '../../utils/validators';

const ProfilePage: React.FC = () => {
    const { user, updateUser, isLoading: userLoading, error: userError, retryFetch } = useUser();
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Format date for display
    const formatDate = (dateString?: string): string => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Handle field updates
    const handleFieldUpdate = useCallback(
        async (field: 'name' | 'academicInfo' | 'expertise', value: string) => {
            setUpdateError(null);
            setUpdateSuccess(false);

            try {
                await updateUser({
                    [field]: value,
                });
                setUpdateSuccess(true);
                // Clear success message after 3 seconds
                setTimeout(() => setUpdateSuccess(false), 3000);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
                setUpdateError(errorMessage);
            }
        },
        [updateUser]
    );

    // Loading state
    if (userLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    // User not loaded and has error
    if (!user && userError) {
        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Profile
                </Typography>
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={retryFetch}>
                            Retry
                        </Button>
                    }
                >
                    {userError}
                </Alert>
            </Box>
        );
    }

    // User not loaded (shouldn't happen, but defensive check)
    if (!user) {
        return (
            <Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Profile
                </Typography>
                <Alert severity="error">Unable to load user profile. Please try again later.</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                My Profile
            </Typography>

            {/* Success Message */}
            {updateSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setUpdateSuccess(false)}>
                    Profile updated successfully!
                </Alert>
            )}

            {/* Error Message */}
            {updateError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUpdateError(null)}>
                    {updateError}
                </Alert>
            )}

            {/* Account Information Section */}
            <ProfileSection
                title="Account Information"
                description="Your account details and credentials"
            >
                <ReadOnlyField label="Email Address" value={user.email} />
                <ReadOnlyField label="User ID" value={user._id} />
                <ReadOnlyField
                    label="Member Since"
                    value={formatDate(user.createdAt)}
                />
            </ProfileSection>

            {/* Personal Information Section */}
            <ProfileSection
                title="Personal Information"
                description="Update your personal details"
            >
                <EditableField
                    label="Full Name"
                    value={user.name}
                    onSave={(value) => handleFieldUpdate('name', value)}
                    validator={validateName}
                    disabled={userLoading}
                />
                <EditableField
                    label="Academic Information"
                    value={user.academicInfo}
                    onSave={(value) => handleFieldUpdate('academicInfo', value)}
                    multiline
                    rows={3}
                    disabled={userLoading}
                />
                <EditableField
                    label="Expertise"
                    value={user.expertise}
                    onSave={(value) => handleFieldUpdate('expertise', value)}
                    multiline
                    rows={3}
                    disabled={userLoading}
                />
            </ProfileSection>

            {/* Account Status Section */}
            <ProfileSection
                title="Account Status"
                description="Your account status and contribution metrics"
            >
                <ReadOnlyField
                    label="Account Status"
                    value={user.accountStatus}
                    variant="chip"
                    color={
                        user.accountStatus === 'active'
                            ? 'success'
                            : user.accountStatus === 'inactive'
                              ? 'warning'
                              : 'default'
                    }
                />
                <ReadOnlyField
                    label="Role"
                    value={user.role}
                    variant="chip"
                    color="primary"
                />
                <ReadOnlyField
                    label="Contribution Score"
                    value={user.contributionScore ?? 0}
                    variant='chip'
                    color= 'primary'
                />
            </ProfileSection>

            {/* Additional Information */}
            {(user.createdAt || user.updatedAt) && (
                <ProfileSection title="Additional Information">
                    {user.createdAt && (
                        <ReadOnlyField
                            label="Account Created"
                            value={formatDate(user.createdAt)}
                        />
                    )}
                    {user.updatedAt && (
                        <ReadOnlyField
                            label="Last Updated"
                            value={formatDate(user.updatedAt)}
                        />
                    )}
                </ProfileSection>
            )}
            {/* Danger Zone / Logout */}
            <Box sx={{ mt: 5, mb: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 600 }}>
                    Account Actions
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{ 
                        py: 1.5, 
                        px: 4, 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Log Out of CampusConnect
                </Button>
            </Box>
        </Box>
    );
};

export default ProfilePage;
