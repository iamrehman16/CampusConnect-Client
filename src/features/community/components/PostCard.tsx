import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Stack,
  Collapse
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import type { Post } from '../types/community.dto';
import { useAuth } from '@/shared/hooks/useAuth';
import { formatRelativeTime } from '@/shared/utils/format';
import { canEditPost } from '../utils/permissions';
import { useUpdatePost, useDeletePost, useToggleUpvote } from '../hooks/community.hooks';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [showComments, setShowComments] = useState(false);

  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: toggleUpvote } = useToggleUpvote();

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditSubmit = () => {
    updatePost(
      { postId: post._id, dto: { title: editTitle, content: editContent } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deletePost(post._id);
    handleMenuClose();
  };

  const hasEditPermission = canEditPost(user, post.author);
  const isUpvoted = user && post.upvotes.includes(user._id);

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'secondary.main' }}>
            {post.author.name?.[0]?.toUpperCase() || 'U'}
          </Avatar>
        }
        action={
          hasEditPermission ? (
            <>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem
                  onClick={() => {
                    setIsEditing(true);
                    handleMenuClose();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : null
        }
        title={post.author.name || 'Unknown'}
        subheader={formatRelativeTime(post.createdAt)}
      />
      <CardContent>
        {isEditing ? (
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={isUpdating}
              label="Title"
            />
            <TextField
              fullWidth
              multiline
              minRows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={isUpdating}
              label="Content"
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                size="small"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(post.title);
                  setEditContent(post.content);
                }}
              >
                Cancel
              </Button>
              <Button size="small" variant="contained" onClick={handleEditSubmit} disabled={isUpdating}>
                Save
              </Button>
            </Stack>
          </Stack>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
          </>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={() => toggleUpvote(post._id)} aria-label="upvote">
          {isUpvoted ? <ThumbUpIcon color="primary" /> : <ThumbUpOutlinedIcon />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {post.upvotes.length}
        </Typography>
        <IconButton onClick={() => setShowComments(!showComments)} aria-label="comments">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2">{post.commentCount}</Typography>
      </CardActions>
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CommentSection postId={post._id} />
      </Collapse>
    </Card>
  );
}
