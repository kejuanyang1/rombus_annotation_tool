(define (problem scene1)
  (:domain manip)
  (:objects
    tool_01 - item
    tool_04 - item
    tool_05 - item
    tool_07 - item
    tool_08 - item
  )
  (:init
    (ontable tool_01)
    (ontable tool_04)
    (ontable tool_05)
    (ontable tool_07)
    (ontable tool_08)
    (clear tool_01)
    (clear tool_04)
    (clear tool_05)
    (clear tool_07)
    (clear tool_08)
    (handempty)
  )
  (:goal (and ))
)