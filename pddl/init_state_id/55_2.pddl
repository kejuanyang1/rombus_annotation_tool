(define (problem scene1)
  (:domain manip)
  (:objects
    tool_01 - item
    tool_03 - item
    tool_06 - item
    tool_07 - item
    tool_08 - item
  )
  (:init
    (ontable tool_01)
    (ontable tool_03)
    (ontable tool_06)
    (ontable tool_07)
    (ontable tool_08)
    (clear tool_01)
    (clear tool_03)
    (clear tool_06)
    (clear tool_07)
    (clear tool_08)
    (handempty)
  )
  (:goal (and ))
)