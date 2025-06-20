'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/stores/auth';
import { votingService } from '@/lib/api';
import type { VoteAggregateResponse, VoteType } from '@/types';

interface VotingButtonsProps {
  ideaId: number;
  initialVotes?: VoteAggregateResponse;
  showRating?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function VotingButtons({ 
  ideaId, 
  initialVotes, 
  showRating = true, 
  size = 'md' 
}: VotingButtonsProps) {
  const { isAuthenticated, canVote } = useAuth();
  const [votes, setVotes] = useState<VoteAggregateResponse | null>(initialVotes || null);
  const [userVote, setUserVote] = useState<VoteType | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  // Fetch vote data from backend
  useEffect(() => {
    const fetchVoteData = async () => {
      if (!votes) {
        try {
          const voteData = await votingService.getVoteAggregates(ideaId);
          setVotes(voteData);
        } catch (error) {
          console.error('Error fetching vote data:', error);
          // Fallback to mock data if backend is not available
          setVotes({
            idea_id: ideaId,
            upvote_count: 0,
            downvote_count: 0,
            total_votes: 0,
            rating_count: 0,
            average_rating: 0,
            score: 0,
            last_updated: new Date().toISOString()
          });
        }
      }
    };

    fetchVoteData();
  }, [ideaId, votes]);

  const handleVote = async (voteType: VoteType) => {
    if (!isAuthenticated || !canVote() || isVoting) return;

    setIsVoting(true);
    try {
      // Remove existing vote if same type
      if (userVote === voteType) {
        await votingService.removeVote(ideaId);
        setUserVote(null);
        updateVoteCount(voteType, false);
      } else {
        // Cast new vote
        await votingService.castVote({ idea_id: ideaId, vote_type: voteType });
        
        // Update local state
        if (userVote) {
          updateVoteCount(userVote, false); // Remove old vote
        }
        updateVoteCount(voteType, true); // Add new vote
        setUserVote(voteType);
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Revert optimistic updates on error
      if (userVote) {
        updateVoteCount(userVote, true);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!isAuthenticated || !canVote() || isVoting) return;

    setIsVoting(true);
    try {
      await votingService.castVote({ 
        idea_id: ideaId, 
        vote_type: userVote || 'upvote',
        rating 
      });
      setUserRating(rating);
      
      // Update average rating (simplified calculation)
      if (votes) {
        const newTotal = userRating ? votes.rating_count : votes.rating_count + 1;
        const newSum = (votes.average_rating * votes.rating_count) - (userRating || 0) + rating;
        const newAverage = newSum / newTotal;
        
        setVotes({
          ...votes,
          rating_count: newTotal,
          average_rating: newAverage
        });
      }
    } catch (error) {
      console.error('Error rating:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const updateVoteCount = (voteType: VoteType, isAdding: boolean) => {
    if (!votes) return;

    const increment = isAdding ? 1 : -1;
    const newVotes = {
      ...votes,
      [voteType === 'upvote' ? 'upvote_count' : 'downvote_count']: 
        votes[voteType === 'upvote' ? 'upvote_count' : 'downvote_count'] + increment,
      total_votes: votes.total_votes + increment,
      score: votes.upvote_count - votes.downvote_count + 
        (voteType === 'upvote' ? increment : -increment)
    };
    
    setVotes(newVotes);
  };

  if (!votes) {
    return (
      <div className="flex items-center space-x-2">
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
      </div>
    );
  }

  const buttonSize = size === 'lg' ? 'default' : size === 'sm' ? 'sm' : 'default';
  const iconSize = size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <div className="space-y-3">
      {/* Voting Buttons */}
      <div className="flex items-center space-x-2">
        <Button
          variant={userVote === 'upvote' ? 'default' : 'outline'}
          size={buttonSize}
          onClick={() => handleVote('upvote')}
          disabled={!isAuthenticated || !canVote() || isVoting}
          className={userVote === 'upvote' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          <ThumbsUp className={`mr-1 ${iconSize}`} />
          {votes.upvote_count}
        </Button>
        
        <Button
          variant={userVote === 'downvote' ? 'default' : 'outline'}
          size={buttonSize}
          onClick={() => handleVote('downvote')}
          disabled={!isAuthenticated || !canVote() || isVoting}
          className={userVote === 'downvote' ? 'bg-red-600 hover:bg-red-700' : ''}
        >
          <ThumbsDown className={`mr-1 ${iconSize}`} />
          {votes.downvote_count}
        </Button>

        <div className="text-sm text-gray-500 ml-4">
          Score: <span className="font-medium">{votes.score}</span>
        </div>
      </div>

      {/* Rating System */}
      {showRating && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Rate:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={!isAuthenticated || !canVote() || isVoting}
                className={`p-1 rounded ${
                  star <= (userRating || 0)
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-300'
                } ${(!isAuthenticated || !canVote()) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <Star className={`${iconSize} ${star <= (userRating || 0) ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({votes.average_rating.toFixed(1)} avg, {votes.rating_count} ratings)
          </span>
        </div>
      )}

      {/* Login prompt for unauthenticated users */}
      {!isAuthenticated && (
        <p className="text-xs text-gray-500">
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>{' '}
          to vote and rate ideas
        </p>
      )}
    </div>
  );
}