(define (problem scene1)
  (:domain manip)
  (:objects
    office_02 - item
    office_04 - item
    tool_01 - item
    tool_03 - item
    container_03 - container
    container_04 - container
  )
  (:init
    (in office_02 container_03)
    (ontable office_04)
    (ontable tool_01)
    (in tool_03 container_04)
    (ontable container_03)
    (ontable container_04)
    (clear office_02)
    (clear office_04)
    (clear tool_01)
    (clear tool_03)
    (handempty)
  )
  (:goal (and ))
)