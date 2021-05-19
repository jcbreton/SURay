require_relative 'wavefile/buffer'
require_relative 'wavefile/chunk_readers/riff_reader'
require_relative 'wavefile/chunk_readers/base_chunk_reader'
require_relative 'wavefile/chunk_readers/data_chunk_reader'
require_relative 'wavefile/chunk_readers/format_chunk_reader'
require_relative 'wavefile/chunk_readers/sample_chunk_reader'
require_relative 'wavefile/duration'
require_relative 'wavefile/format'
require_relative 'wavefile/reader'
require_relative 'wavefile/sampler_info'
require_relative 'wavefile/sampler_loop'
require_relative 'wavefile/smpte_timecode'
require_relative 'wavefile/unvalidated_format'
require_relative 'wavefile/writer'

module WaveFile
  VERSION = "1.1.1"

  WAVEFILE_FORMAT_CODE = "WAVE"    # :nodoc:
  FORMAT_CODES = {:pcm => 1, :float => 3, :extensible => 65534}.freeze    # :nodoc:
  SUB_FORMAT_GUID_PCM = String.new("\x01\x00\x00\x00\x00\x00\x10\x00\x80\x00\x00\xAA\x00\x38\x9B\x71").force_encoding("ASCII-8BIT").freeze   # :nodoc:
  SUB_FORMAT_GUID_FLOAT = String.new("\x03\x00\x00\x00\x00\x00\x10\x00\x80\x00\x00\xAA\x00\x38\x9B\x71").force_encoding("ASCII-8BIT").freeze   # :nodoc:
  CHUNK_IDS = {:riff         => "RIFF",
               :format       => "fmt ",
               :data         => "data",
               :fact         => "fact",
               :silence      => "slnt",
               :cue          => "cue ",
               :playlist     => "plst",
               :list         => "list",
               :label        => "labl",
               :labeled_text => "ltxt",
               :note         => "note",
               :sample       => "smpl",
               :instrument   => "inst" }.freeze    # :nodoc:

  PACK_CODES = {:pcm   => { 8  => "C*", 16 => "s<*", 24 => "C*", 32 => "l<*"}.freeze,
                :float => { 32 => "e*", 64 => "E*"}.freeze}.freeze    # :nodoc:

  UNSIGNED_INT_16 = "v"    # :nodoc:
  UNSIGNED_INT_32 = "V"    # :nodoc:
end
