import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  profile: Profile;
};

export default function ProfileHeader({ profile }: Props) {
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={profile.imageUrl}
              alt={profile.displayName + " image"}
              sx={{ width: 150, height: 150 }}
            />
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h4">{profile.displayName}</Typography>
              {profile.following && (
                <Chip
                  variant="outlined"
                  color="secondary"
                  label="Following"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>
          </Stack>
        </Grid>
        <Grid size={4}>
          <Stack spacing={2} alignItems="center">
            <Box display="flex" justifyContent="space-around" width="100%">
              <Box textAlign="center">
                <Typography variant="h6">Followers</Typography>
                <Typography variant="h3">{profile.followersCount}</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="h6">Following</Typography>
                <Typography variant="h3">{profile.followingCount}</Typography>
              </Box>
            </Box>
            <Divider sx={{ width: "100%" }} />
            <Button
              fullWidth
              variant="outlined"
              color={profile.following ? "error" : "success"}
            >
              {profile.following ? "Unfollow" : "Follow"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
