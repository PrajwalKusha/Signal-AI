import json
import os
from datetime import datetime
from typing import List, Dict, Any

class SignalStorage:
    """
    Manages persistent storage of signals in a JSON file.
    Handles deduplication based on signal_id.
    """
    
    def __init__(self, storage_path: str):
        self.storage_path = storage_path
        self._ensure_storage_exists()
    
    def _ensure_storage_exists(self):
        """Create storage file if it doesn't exist"""
        if not os.path.exists(self.storage_path):
            os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
            self._write_signals([])
    
    def _read_signals(self) -> List[Dict[str, Any]]:
        """Read all signals from storage"""
        try:
            with open(self.storage_path, 'r') as f:
                data = json.load(f)
                return data.get('signals', [])
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def _write_signals(self, signals: List[Dict[str, Any]]):
        """Write signals to storage with metadata"""
        data = {
            'last_updated': datetime.now().isoformat(),
            'total_signals': len(signals),
            'signals': signals
        }
        with open(self.storage_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_all_signals(self) -> List[Dict[str, Any]]:
        """Retrieve all stored signals"""
        return self._read_signals()
    
    def add_signals(self, new_signals: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Add new signals to storage, deduplicating by signal_id.
        Returns statistics about the operation.
        """
        existing_signals = self._read_signals()
        existing_ids = {s['signal_id']: i for i, s in enumerate(existing_signals)}
        
        added_count = 0
        updated_count = 0
        
        for signal in new_signals:
            signal_id = signal.get('signal_id')
            if not signal_id:
                continue
            
            # Add timestamp metadata
            if signal_id in existing_ids:
                # Update existing signal
                idx = existing_ids[signal_id]
                signal['last_updated'] = datetime.now().isoformat()
                signal['first_detected'] = existing_signals[idx].get('first_detected', datetime.now().isoformat())
                existing_signals[idx] = signal
                updated_count += 1
            else:
                # Add new signal
                signal['first_detected'] = datetime.now().isoformat()
                signal['last_updated'] = datetime.now().isoformat()
                existing_signals.append(signal)
                added_count += 1
        
        # Sort by last_updated (newest first)
        existing_signals.sort(key=lambda x: x.get('last_updated', ''), reverse=True)
        
        self._write_signals(existing_signals)
        
        return {
            'total': len(existing_signals),
            'added': added_count,
            'updated': updated_count
        }
    
    def get_signal_by_id(self, signal_id: str) -> Dict[str, Any] | None:
        """Retrieve a specific signal by ID"""
        signals = self._read_signals()
        for signal in signals:
            if signal.get('signal_id') == signal_id:
                return signal
        return None
    
    def clear_all(self):
        """Clear all signals (use with caution)"""
        self._write_signals([])
