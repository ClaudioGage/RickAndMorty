import React from 'react';
import styled from 'styled-components';
import { Heart } from 'lucide-react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
  onToggleFavorite: (id: number) => void;
}

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: ${props => props.isFavorite ? '#ff4757' : 'rgba(255, 255, 255, 0.9)'};
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 16px;
`;

const CharacterName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const CharacterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  color: #666;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.span<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.status === 'Alive' ? '#55a3ff' :
    props.status === 'Dead' ? '#ff4757' : '#ffa502'
  };
`;

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onToggleFavorite }) => {
  return (
    <CardContainer>
      <ImageContainer>
        <CharacterImage src={character.image} alt={character.name} />
        <FavoriteButton
          isFavorite={character.isFavorite}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(character.id);
          }}
        >
          <Heart
            size={20}
            fill={character.isFavorite ? 'white' : 'none'}
            color={character.isFavorite ? 'white' : '#666'}
          />
        </FavoriteButton>
      </ImageContainer>
      <CardContent>
        <CharacterName>{character.name}</CharacterName>
        <CharacterInfo>
          <StatusInfo>
            <StatusDot status={character.status} />
            <span>{character.status} - {character.species}</span>
          </StatusInfo>
          <div>
            <strong>Gender:</strong> {character.gender}
          </div>
          <div>
            <strong>Location:</strong> {character.location.name}
          </div>
        </CharacterInfo>
      </CardContent>
    </CardContainer>
  );
};